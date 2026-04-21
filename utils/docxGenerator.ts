/**
 * DOCX generator utility for the SENGE-CE registration update form.
 * Creates a formatted Word document matching the ATUALIZAÇÃO CADASTRAL layout.
 */

import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} from 'docx';
import { FormData, Dependent } from '@/types/form';

/**
 * Creates a section header paragraph with blue background styling.
 */
function createSectionHeader(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        color: 'FFFFFF',
        size: 24,
        font: 'Arial',
      }),
    ],
    alignment: AlignmentType.CENTER,
    shading: {
      fill: '4AABE0',
    },
    spacing: { before: 200, after: 100 },
  });
}

/**
 * Creates a labeled field row with the field name and value.
 */
function createFieldRow(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        size: 22,
        font: 'Arial',
      }),
      new TextRun({
        text: value || '-',
        size: 22,
        font: 'Arial',
      }),
    ],
    spacing: { before: 60, after: 60 },
  });
}

/**
 * Creates a table row for dependent data.
 */
function createDependentRow(dep: Dependent): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: dep.nome || '-', size: 20, font: 'Arial' })] })],
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: dep.parentesco || '-', size: 20, font: 'Arial' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: dep.nascimento || '-', size: 20, font: 'Arial' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: dep.cpf || '-', size: 20, font: 'Arial' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
      }),
    ],
  });
}

/**
 * Creates the dependents table with header row.
 */
function createDependentsTable(dependentes: Dependent[]): Table | null {
  if (dependentes.length === 0) return null;

  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'NOME', bold: true, size: 20, font: 'Arial' })] })],
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: { fill: 'EBF5FB' },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'PARENTESCO', bold: true, size: 20, font: 'Arial' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: 'EBF5FB' },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'NASC.', bold: true, size: 20, font: 'Arial' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: 'EBF5FB' },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: 'CPF', bold: true, size: 20, font: 'Arial' })] })],
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: 'EBF5FB' },
      }),
    ],
  });

  return new Table({
    rows: [headerRow, ...dependentes.map(createDependentRow)],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

/**
 * Generates a DOCX document from the form data.
 * @param formData - The registration form data
 * @returns A Document object ready to be packed
 */
export function generateRegistrationDocx(formData: FormData): Document {
  const sections: Paragraph[] = [];

  // Header
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'SENGE.CE',
          bold: true,
          size: 28,
          font: 'Arial',
          color: '0D2B5E',
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Sindicato dos Engenheiros no Estado do Ceará',
          size: 20,
          font: 'Arial',
          color: '4A5568',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Rua: Alegre, 01 Praia de Iracema, CEP: 60.060-280 – Fortaleza-CE',
          size: 18,
          font: 'Arial',
          color: '4A5568',
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'CNPJ: 05.242.714/0001-20  Fone: (85) 3219-0099',
          size: 18,
          font: 'Arial',
          color: '4A5568',
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );

  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'E-mail: atendimento@sengece.org.br | Site: www.sengece.org.br',
          size: 18,
          font: 'Arial',
          color: '4A5568',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Title banner
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'ATUALIZAÇÃO CADASTRAL',
          bold: true,
          size: 32,
          font: 'Arial',
          color: 'FFFFFF',
        }),
      ],
      alignment: AlignmentType.CENTER,
      shading: { fill: '0D2B5E' },
      spacing: { before: 200, after: 300 },
    })
  );

  // DADOS PESSOAIS
  sections.push(createSectionHeader('Dados Pessoais'));
  sections.push(createFieldRow('Nome', formData.nome));
  sections.push(createFieldRow('Nome da mãe', formData.nomeMae));
  sections.push(createFieldRow('Data de Nascimento', formData.dataNascimento));
  sections.push(createFieldRow('Estado Civil', formData.estadoCivil));
  sections.push(createFieldRow('Nacionalidade', formData.nacionalidade));
  sections.push(createFieldRow('Naturalidade', formData.naturalidade));
  sections.push(createFieldRow('CPF', formData.cpf));
  sections.push(createFieldRow('RG', formData.rg));

  // ENDEREÇO
  sections.push(createSectionHeader('Endereço'));
  sections.push(createFieldRow('Residência', formData.residencia));
  sections.push(createFieldRow('Bairro', formData.bairro));
  sections.push(createFieldRow('CEP', formData.cep));
  sections.push(createFieldRow('Cidade', formData.cidade));
  sections.push(createFieldRow('Estado', formData.estado));
  sections.push(createFieldRow('Telefone de Contato', formData.telefoneContato));
  sections.push(createFieldRow('Celular (WhatsApp)', formData.celularWhatsapp));
  sections.push(createFieldRow('E-mail', formData.email));

  // DADOS PROFISSIONAIS
  sections.push(createSectionHeader('Dados Profissionais'));
  sections.push(createFieldRow('Curso de Graduação', formData.cursoGraduacao));
  sections.push(createFieldRow('Outras Titulações', formData.outrasTitulacoes));
  sections.push(createFieldRow('Instituição', formData.instituicao));
  sections.push(createFieldRow('Ano da Colação de Grau', formData.anoColacaoGrau));
  sections.push(createFieldRow('Carteira Confea-RNP nº', formData.carteiraConfeaRNP));
  sections.push(createFieldRow('Data de Emissão', formData.dataEmissao));

  // ATIVIDADES PROFISSIONAIS
  sections.push(createSectionHeader('Atividades Profissionais'));
  sections.push(createFieldRow('Empresa onde trabalha', formData.empresaOndeTrabalha));
  sections.push(createFieldRow('Data de admissão', formData.dataAdmissao));
  sections.push(createFieldRow('Cargo', formData.cargo));
  sections.push(createFieldRow('Telefone', formData.telefoneEmpresa));
  sections.push(createFieldRow('Endereço', formData.enderecoEmpresa));

  // DEPENDENTES PARA UNIMED
  sections.push(createSectionHeader('Dependentes para Unimed'));
  const dependentsTable = createDependentsTable(formData.dependentes);
  if (dependentsTable) {
    sections.push(new Paragraph({ children: [] })); // Spacer
  }

  // Observações
  sections.push(new Paragraph({ children: [], spacing: { before: 200 } }));
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Observação:',
          bold: true,
          size: 22,
          font: 'Arial',
        }),
      ],
      spacing: { before: 200 },
    })
  );
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '1) Para profissional: anexar cópia da carteira do CREA/CAU ou diploma comprovante de endereço;',
          size: 20,
          font: 'Arial',
        }),
      ],
    })
  );
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '2) A inadimplência com as contribuições sociais acarretará perda(s) dos(s) serviço(s)/benefícios(s)',
          size: 20,
          font: 'Arial',
        }),
      ],
      spacing: { after: 200 },
    })
  );

  // Build document
  const doc = new Document({
    sections: [
      {
        children: dependentsTable ? [...sections.slice(0, -5), dependentsTable, ...sections.slice(-5)] : sections,
      },
    ],
  });

  return doc;
}
