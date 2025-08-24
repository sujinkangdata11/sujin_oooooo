/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

import {FunctionDeclaration, GoogleGenAI} from '@google/genai';

const systemInstruction = `When given a video and a query, call the relevant \
function only once with the appropriate timecodes and text for the video`;

async function generateContent(
  text: string,
  functionDeclarations: FunctionDeclaration[],
  youtubeUrl: string,
  apiKey: string,
) {
  // API 키 정리 및 검증
  const cleanApiKey = apiKey.trim().replace(/[^\x00-\x7F]/g, ""); // ASCII 문자만 유지
  console.log('API 호출 시작:', cleanApiKey ? 'API 키 있음' : 'API 키 없음');
  
  if (!cleanApiKey) {
    throw new Error('API 키가 올바르지 않습니다. 영문과 숫자만 포함된 올바른 API 키를 입력해주세요.');
  }
  
  const ai = new GoogleGenAI({apiKey: cleanApiKey});
  
  try {
    const response = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: [{
        parts: [
          {
            fileData: {
              fileUri: youtubeUrl,
            },
          },
          {
            text: text, // 여기에 A/V captions, Custom 등 각 버튼의 프롬프트가 들어감
          },
        ],
      }],
      config: {
        systemInstruction,
        temperature: 0.5,
        tools: functionDeclarations.length > 0 ? [{functionDeclarations}] : undefined,
      },
    });
    
    console.log('API 응답 받음:', response);
    return response;
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
}

export {generateContent};