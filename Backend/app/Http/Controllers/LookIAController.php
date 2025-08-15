<?php

namespace App\Http\Controllers;

use Gemini\Data\GenerationConfig;
use Gemini\Enums\ResponseModality;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Gemini\Laravel\Facades\Gemini;
use Gemini\Data\Blob;
use Gemini\Enums\MimeType;
use Gemini\Responses\GenerativeModel\GenerateContentResponse;
use Exception;

class LookIAController extends Controller
{
    /**
     * Gera uma crítica de moda sobre um look.
     */
    public function geraComentario(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:10240',
        ]);

        // 1. Processa a imagem. Se retornar uma Response, é um erro e já o retorna.
        $processedImage = $this->processarImagemUpload($request->file('image'));
        if ($processedImage instanceof Response) {
            return $processedImage;
        }
        ['content' => $conteudoImagem, 'mimeType' => $mimeType] = $processedImage;

        // 2. Prepara o prompt específico para esta ação
        $promptTexto = "Act as a discerning and honest professional fashion stylist. Your task is to provide a realistic and balanced professional assessment of the outfit in the image. Your critique should not be rude, but it must be direct and not shy away from pointing out elements that are clearly clashing or poorly executed. The goal is to provide a critique that a real-world stylist would give.

Structure your response in a few flowing paragraphs. Do not use lists or headings. Begin with a neutral, high-level observation of the look. Follow this with a brief discussion of the outfit's successful elements. After acknowledging the strengths, shift your focus to a detailed analysis of the less successful aspects. Identify and discuss elements that are discordant, lack harmony, or could be improved, without resorting to excessive praise. For each point of criticism, immediately follow up with a specific, actionable suggestion to resolve the issue.

For accessories, strictly limit your feedback to the items already present in the image. Propose alternative colors, styles, or models for those specific items only. Do not invent or suggest adding accessories that are not visible in the photo. Ensure your advice is logical and consistent.

Conclude with a succinct final verdict that summarizes your overall professional take on the look, leaving the reader with a clear takeaway. Please respond in Portuguese.";

        // 3. Chama a API do Gemini de forma centralizada
        $result = $this->chamarApiGemini($promptTexto, $conteudoImagem, $mimeType);
        if ($result instanceof Response) {
            return $result;
        }

        // 4. Processa a resposta de texto de forma mais limpa
        $resp = $result->text();

        return $resp === ''
            ? response('Não foi possível gerar o comentário. Tente novamente.', 500)
            : response($resp, 200);
    }

    /**
     * Gera uma imagem de um look com base em parâmetros.
     */
    public function gerarLook(Request $request)
    {
        $validatedData = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:10240',
            'gender' => 'required|string|in:woman,man',
            'skinColor' => 'required|string|in:WHITE,BLACK,ASIAN,LATIN',
            'weight' => 'required|integer|min:40|max:350',
            'height' => 'required|integer|min:60|max:250',
        ]);

        // 1. Processa a imagem. Se retornar uma Response, é um erro e já o retorna.
        $processedImage = $this->processarImagemUpload($request->file('image'));
        if ($processedImage instanceof Response) {
            return $processedImage;
        }
        ['content' => $conteudoImagem, 'mimeType' => $mimeType] = $processedImage;

        // 2. Prepara o prompt específico para esta ação
        $bmiValue = $validatedData['weight'] / (($validatedData['height'] / 100) ** 2);
        $bmiDescription = match (true) {
            $bmiValue < 17 => '**A PERSON WITH A VERY VERY LOW BODY MASS INDEX (10 BMI)**, ',
            $bmiValue < 20 => '**A THIN PERSON**, ',
            $bmiValue < 25 => '*A SLIM PERSON*',
            $bmiValue < 36 => '**A SLIM TO OVERWEIGHT PERSON (80KG, 1.8m, NOT OBESE)**, ',
            default => '**AN OBESE PERSON**, '
        };

        $promptTexto = "Generate a **REALISTIC PHOTOGRAPH** of *A " . strtoupper($validatedData['gender']) . "*, *" . $validatedData['skinColor'] . " SKIN COLOR PERSON*, " . $bmiDescription . " *FULL BODY*, wearing ALL the clothing items from this image.
**ALL** the details, characteristics, and **especially the colors of the pieces must be PRESERVED EXACTLY AS THEY ARE**.
*Include a **LIGHT**, **NEUTRAL**, **SOFT** background that doesn\'t interfere with the outfit. The total visible height of the background in the final image must be 2.5 meters (8.2 feet), ensuring there is ample space above the person's head.*
*A HAIRSTYLE THAT SUITS YOUR FACE*.";


        // 3. Chama a API do Gemini de forma centralizada
        $result = $this->chamarApiGemini($promptTexto, $conteudoImagem, $mimeType);
        if ($result instanceof Response) {
            return $result;
        }

        // 4. Processa a resposta de imagem
        foreach ($result->parts() as $part) {
            if ($part->inlineData) {
                return new Response(base64_decode($part->inlineData->data), 200, [
                    'Content-Type' => $part->inlineData->mimeType->value,
                    'Access-Control-Allow-Origin' => '*',
                    'Access-Control-Allow-Methods' => 'POST, OPTIONS',
                    'Access-Control-Allow-Headers' => 'Content-Type'
                ]);
            }
        }

        return response('O modelo não retornou uma imagem.', 500);
    }

    // -------------------------------------------------------------------
    // MÉTODOS PRIVADOS DE APOIO (REUTILIZÁVEIS)
    // -------------------------------------------------------------------

    /**
     * Valida, lê e prepara uma imagem para a API.
     * Retorna um array com 'content' e 'mimeType' em caso de sucesso,
     * ou uma Response de erro em caso de falha.
     *
     * @param UploadedFile|null $imagem
     * @return array|Response
     */
    private function processarImagemUpload(?UploadedFile $imagem): array|Response
    {
        if (!$imagem || !$imagem->isValid()) {
            return response('ERRO: Falha no upload ou imagem inválida.', 400);
        }

        try {
            $conteudo = file_get_contents($imagem->getRealPath());
            if ($conteudo === false) {
                return response('ERRO: Não foi possível ler o conteúdo da imagem.', 500);
            }
        } catch (Exception $e) {
            // Opcional: Logar o erro para debug. Ex: \Log::error($e);
            return response('ERRO ao ler a imagem: ' . $e->getMessage(), 500);
        }

        return [
            'content' => $conteudo,
            'mimeType' => $imagem->getMimeType()
        ];
    }

    /**
     * Encapsula a chamada para a API do Gemini.
     * Retorna o objeto de resultado em caso de sucesso,
     * ou uma Response de erro em caso de falha.
     *
     * @param string $prompt
     * @param string $conteudoImagem (não codificado em base64)
     * @param string $mimeType
     * @return GenerateContentResponse|Response
     */
    private function chamarApiGemini(string $prompt, string $conteudoImagem, string $mimeType): GenerateContentResponse|Response
    {
        try {
            return Gemini::generativeModel(model: 'gemini-2.0-flash-preview-image-generation')
                ->withGenerationConfig(
                    generationConfig: new GenerationConfig(
                        responseModalities: [ResponseModality::IMAGE, ResponseModality::TEXT]
                    )
                )
                ->generateContent([
                        $prompt,
                        new Blob(
                            mimeType: MimeType::from($mimeType),
                            data: base64_encode($conteudoImagem)
                        )
                    ]
                );
        } catch (Exception $e) {
            // Opcional: Logar o erro para debug. Ex: \Log::error($e);
            return response('ERRO ao se comunicar com a API do Gemini: ' . $e->getMessage(), 500);
        }
    }
}
