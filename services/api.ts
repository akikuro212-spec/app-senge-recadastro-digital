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
import { Platform } from 'react-native';

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

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const cpfClean = formData.cpf.replace(/\D/g, '');
  const filename = `atualizacao-cadastral-${cpfClean}-${timestamp}.docx`;

  if (Platform.OS === 'web') {
    // Web platform: use Blob API
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // Mobile platform: use ArrayBuffer and base64 encoding
    const buffer = await Packer.toBuffer(doc);

    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    // Convert ArrayBuffer to base64 string
    let base64String = '';
    const view = new Uint8Array(buffer);
    for (let i = 0; i < view.byteLength; i++) {
      base64String += String.fromCharCode(view[i]);
    }
    const base64 = btoa(base64String);

    // Write file to document directory
    await FileSystem.writeAsStringAsync(fileUri, base64, {
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
