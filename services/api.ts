/**
 * Mock API service for the SENGE-CE registration update form.
 * In production this would send an HTTP PATCH/PUT request to the
 * backend REST endpoint to update the member record in the database.
 */

import { FormData } from '@/types/form';
import { Packer } from 'docx';
import { generateRegistrationDocx } from '@/utils/docxGenerator';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/** Simulated network latency in milliseconds */
const MOCK_DELAY_MS = 1500;

/** Response shape returned by the update endpoint */
export interface ApiResponse {
  success: boolean;
  message: string;
  updatedAt?: string;
}

/**
 * Generates a DOCX file from form data and triggers download.
 * Works on web and mobile platforms.
 */
async function downloadDocx(formData: FormData): Promise<void> {
  const doc = generateRegistrationDocx(formData);
  const blob = await Packer.toBlob(doc);

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `atualizacao-cadastral-${formData.cpf.replace(/\D/g, '')}-${timestamp}.docx`;

  // Web platform: use standard download
  if (typeof window !== 'undefined' && window.document) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Mobile platform: use expo-file-system and expo-sharing
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });

    const base64Data = await base64Promise;
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Share/download the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        dialogTitle: 'Salvar Atualização Cadastral',
        UTI: 'com.microsoft.word.doc',
      });
    }
  }
}

/**
 * Sends the registration update form data to the REST API.
 * Currently mocked: waits MOCK_DELAY_MS then returns a success response.
 *
 * @param formData - Validated form data to be sent to the server
 * @returns Promise resolving to an ApiResponse object
 */
export async function submitRegistrationUpdate(formData: FormData): Promise<ApiResponse> {
  /* Simulate async network request */
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  /*
   * Production implementation would look like:
   *
   * const response = await fetch('https://api.sengece.org.br/members/update', {
   *   method: 'PUT',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify(formData),
   * });
   * if (!response.ok) throw new Error(await response.text());
   * return response.json();
   */

  /* Log payload for development inspection */
  console.log('[MOCK API] PUT /members/update', JSON.stringify(formData, null, 2));

  // Generate and download DOCX file
  try {
    await downloadDocx(formData);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    // Still return success even if download fails
  }

  return {
    success: true,
    message: 'Cadastro atualizado com sucesso!',
    updatedAt: new Date().toISOString(),
  };
}
