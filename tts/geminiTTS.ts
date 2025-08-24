/**
 * Gemini TTS API 호출 관련 함수들
 * REST API 방식으로 Gemini TTS를 호출하고 오디오 데이터를 처리
 */

export interface TTSRequest {
  text: string;
  voiceName: string;
  apiKey: string;
}

export interface TTSResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        inlineData: {
          data: string; // Base64 encoded PCM data
        }
      }>
    }
  }>
}

/**
 * Gemini TTS API를 호출하여 음성 생성
 */
export async function callGeminiTTS(request: TTSRequest): Promise<TTSResponse> {
  console.log('🎵 Gemini TTS API 호출 시작:', {
    text: request.text.substring(0, 50) + '...',
    voiceName: request.voiceName,
    hasApiKey: !!request.apiKey
  });

  const requestBody = {
    contents: [{
      parts: [{
        text: request.text // 사용자가 입력한 대사
      }]
    }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: request.voiceName // 매핑된 Gemini 음성 이름
          }
        }
      }
    }
  };

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': request.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ TTS API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`TTS API 에러: ${response.status} ${response.statusText}`);
    }

    const data: TTSResponse = await response.json();
    console.log('✅ TTS API 성공적으로 응답 받음');
    
    return data;
  } catch (error) {
    console.error('❌ TTS API 호출 실패:', error);
    throw error;
  }
}

/**
 * Base64 PCM 데이터를 바이너리로 변환
 */
export function convertBase64ToPCM(base64Data: string): Uint8Array {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  return new Uint8Array(byteNumbers);
}

/**
 * TTS 응답에서 오디오 데이터 추출
 */
export function extractAudioData(ttsResponse: TTSResponse): string | null {
  return ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
}