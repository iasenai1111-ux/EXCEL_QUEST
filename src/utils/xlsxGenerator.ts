import * as XLSX from 'xlsx';
import { StudentProfile } from '../types/game';

/**
 * Generates an authentic Excel (.xlsx) workbook customized with SENAIZINHO,
 * the student's name, class, 10 dedicated tab sheets with identical cell references,
 * SENAI color styling, guidelines, and completion checklists.
 */
export function generateStudentWorkbook(profile: StudentProfile | null): void {
  const wb = XLSX.utils.book_new();

  const studentName = profile?.name || 'Aluno SENAI';
  const studentClass = profile?.className || 'Turma Informática';
  const modeText = profile?.mode === 'dupla' && profile?.partnerName
    ? `Em Dupla com: ${profile.partnerName}`
    : 'Modo Individual';

  const baseHeader = [
    ['=== IDENTIFICAÇÃO DO ALUNO (SENAI) ==='],
    ['Herói da Jornada:', 'SENAIZINHO'],
    ['Estudante:', studentName],
    ['Turma:', studentClass],
    ['Modalidade:', modeText],
    ['Data de Geração:', new Date().toLocaleDateString('pt-BR')],
    []
  ];

  // 1. Sheet 1: Mercado das Somas
  const ws1Data = [
    ['Item', 'Caixa 1', 'Caixa 2', 'Total Itens'],
    ['Parafusos', 120, 80, ''], // D2 is target
    ['Status', 'Pronto', 'Pronto', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Clique na célula D2 (destacada acima).'],
    ['2.', 'Digite o sinal de igual (=) para iniciar a fórmula.'],
    ['3.', 'Some a célula B2 com a C2 usando: =B2+C2 ou =SOMA(B2:C2)'],
    ['4.', 'Pressione a tecla Enter no teclado.'],
    ['5.', 'Resultado esperado para conferência: 200'],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
  ws1['!cols'] = [{ wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws1, '1 - Mercado das Somas');

  // 2. Sheet 2: Depósito Perdido
  const ws2Data = [
    ['Equipamento', 'Estoque Inicial', 'Peças Retiradas', 'Saldo Atual'],
    ['Sensores Fotoelétricos', 19, 7, ''], // D2 is target
    ['Controle', 'Entrada', 'Saída', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula D2.'],
    ['2.', 'Inicie com = e subtraia a célula C2 da célula B2: =B2-C2'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 12'],
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2['!cols'] = [{ wch: 25 }, { wch: 16 }, { wch: 16 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws2, '2 - Depósito Perdido');

  // 3. Sheet 3: Fábrica de Controles
  const ws3Data = [
    ['Linha', 'Qtd de Lotes', 'Placas por Lote', 'Produção Total'],
    ['Linha Alfa', 6, 45, ''], // D2 is target
    ['Meta', 'OK', 'OK', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula D2.'],
    ['2.', 'Multiplique os lotes pelas placas usando o asterisco (*): =B2*C2'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 270'],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
  ws3['!cols'] = [{ wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws3, '3 - Fábrica de Controles');

  // 4. Sheet 4: Arena das Médias
  const ws4Data = [
    ['Robô SENAI', 'Teste 1', 'Teste 2', 'Teste 3', 'Média Final'],
    ['TitanBot-01', 6, 8, 10, ''], // E2 is target
    ['Classificação', 'Regular', 'Bom', 'Excelente', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula E2.'],
    ['2.', 'Calcule a média do intervalo B2 até D2 com a função: =MÉDIA(B2:D2)'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 8'],
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(ws4Data);
  ws4['!cols'] = [{ wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws4, '4 - Arena das Médias');

  // 5. Sheet 5: Chefão dos Descontos
  const ws5Data = [
    ['Produto', 'Preço Original', 'Taxa Desconto', 'Preço Final'],
    ['Kit Robótica Pro', 200, 0.15, ''], // D2 is target
    ['Status', 'R$ 200,00', '15%', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula D2.'],
    ['2.', 'Calcule o valor líquido com desconto aplicando: =B2-(B2*C2) ou =B2*(1-C2)'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 170 (R$ 170,00)'],
  ];
  const ws5 = XLSX.utils.aoa_to_sheet(ws5Data);
  ws5['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws5, '5 - Chefão dos Descontos');

  // 6. Sheet 6: Inspeção Condicional (Função SE)
  const ws6Data = [
    ['Peça Calibrada', 'Medição (mm)', 'Cota Mínima', 'Pontuação Bônus'],
    ['Eixo Turbina 01', 75, 50, ''], // D2 is target
    ['Inspeção', 'Conforme', 'Padrão', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula D2.'],
    ['2.', 'Insira a fórmula lógica SE: =SE(B2>=50; 100; 0)'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 100'],
  ];
  const ws6 = XLSX.utils.aoa_to_sheet(ws6Data);
  ws6['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws6, '6 - Inspeção Condicional');

  // 7. Sheet 7: Usina Elétrica (Função MÁXIMO)
  const ws7Data = [
    ['Usina SENAI', 'Gerador 1', 'Gerador 2', 'Gerador 3', 'Pico Máximo'],
    ['Setor Turbinas', 1450, 3200, 2800, ''], // E2 is target
    ['Unidade', 'RPM', 'RPM', 'RPM', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula E2.'],
    ['2.', 'Insira a função para obter o valor mais alto: =MÁXIMO(B2:D2)'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 3200'],
  ];
  const ws7 = XLSX.utils.aoa_to_sheet(ws7Data);
  ws7['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws7, '7 - Usina Elétrica');

  // 8. Sheet 8: Lab de Tolerâncias (Função MÍNIMO)
  const ws8Data = [
    ['Bancada Metrologia', 'Sensor A', 'Sensor B', 'Sensor C', 'Menor Ruído'],
    ['Teste Acústico', 18, 42, 9, ''], // E2 is target
    ['Escala', 'dB', 'dB', 'dB', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula E2.'],
    ['2.', 'Insira a função para obter a menor tolerância: =MÍNIMO(B2:D2)'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 9'],
  ];
  const ws8 = XLSX.utils.aoa_to_sheet(ws8Data);
  ws8['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws8, '8 - Lab de Tolerâncias');

  // 9. Sheet 9: Almoxarifado Sensores (Função CONT.SE)
  const ws9Data = [
    ['Setor Robótica', 'Lote 101', 'Lote 102', 'Lote 103', 'Lotes Aprovados (>=50)'],
    ['Pontuação', 65, 30, 85, ''], // E2 is target
    ['Critério', 'Aprovado', 'Refazer', 'Aprovado', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula E2.'],
    ['2.', 'Insira a função de contagem com critério: =CONT.SE(B2:D2; ">=50")'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 2'],
  ];
  const ws9 = XLSX.utils.aoa_to_sheet(ws9Data);
  ws9['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws9, '9 - Almoxarifado Sensores');

  // 10. Sheet 10: Supercomputador Central (Cálculo Composto)
  const ws10Data = [
    ['Fábrica 4.0', 'Peças Linha 1', 'Peças Linha 2', 'Qtd de Linhas', 'Média por Linha'],
    ['Produção Total', 300, 200, 2, ''], // E2 is target
    ['Supercomputador', 'Ativo', 'Ativo', 'Online', '← PREENCHA AQUI'],
    [],
    ...baseHeader,
    ['=== INSTRUÇÕES DA ATIVIDADE ==='],
    ['1.', 'Selecione a célula E2.'],
    ['2.', 'Some as peças entre parênteses e divida pelas linhas: =(B2+C2)/D2'],
    ['3.', 'Pressione Enter.'],
    ['4.', 'Resultado esperado para conferência: 250'],
    [],
    ['=== CONCLUSÃO DA TRILHA DE 10 FASES ==='],
    ['Parabéns por concluir os 10 desafios do SENAIZINHO!'],
    ['Salve este arquivo e entregue no botão ENTREGAR ATIVIDADE ao seu professor.']
  ];
  const ws10 = XLSX.utils.aoa_to_sheet(ws10Data);
  ws10['!cols'] = [{ wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, ws10, '10 - Supercomputador Central');

  // Trigger download
  const cleanFileName = `ExcelQuest_SENAI_${(profile?.name || 'Senaizinho').replace(/[^a-zA-Z0-9]/g, '_')}_10Fases.xlsx`;
  XLSX.writeFile(wb, cleanFileName);
}

/**
 * Generates the official Teacher's Master Answer Key (.xlsx)
 * with all 10 stages pre-filled with correct formulas and calculated values.
 */
export function generateTeacherMasterWorkbook(): void {
  const wb = XLSX.utils.book_new();

  const baseHeader = [
    ['=== GABARITO OFICIAL DO PROFESSOR (SENAI-SP) ==='],
    ['Instrutor de Formação Profissional:', 'Rafael Pereira'],
    ['Unidade:', 'Escola SENAI “Orlando Laviero Ferraiuolo”'],
    ['Versão:', 'SUPER SENAI BROS: EXCEL WORLD • Edição Docente Root'],
    ['Data:', new Date().toLocaleDateString('pt-BR')],
    ['Status:', 'CONFIDENCIAL • GABARITO COMPLETO DAS 10 FASES'],
    []
  ];

  // 1. Somas
  const ws1 = XLSX.utils.aoa_to_sheet([
    ['Item', 'Caixa 1', 'Caixa 2', 'Total Itens (FÓRMULA)'],
    ['Parafusos', 120, 80, 200],
    ['Gabarito', 'Dado 1', 'Dado 2', '=B2+C2 ou =SOMA(B2:C2)'],
    [],
    ...baseHeader
  ]);
  ws1['!cols'] = [{ wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws1, '1 - Mercado das Somas');

  // 2. Subtração
  const ws2 = XLSX.utils.aoa_to_sheet([
    ['Equipamento', 'Estoque Inicial', 'Peças Retiradas', 'Saldo Atual (FÓRMULA)'],
    ['Sensores Fotoelétricos', 19, 7, 12],
    ['Gabarito', 'Dado 1', 'Dado 2', '=B2-C2'],
    [],
    ...baseHeader
  ]);
  ws2['!cols'] = [{ wch: 25 }, { wch: 16 }, { wch: 16 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws2, '2 - Depósito Perdido');

  // 3. Multiplicação
  const ws3 = XLSX.utils.aoa_to_sheet([
    ['Linha', 'Qtd de Lotes', 'Placas por Lote', 'Produção Total (FÓRMULA)'],
    ['Linha Alfa', 6, 45, 270],
    ['Gabarito', 'Dado 1', 'Dado 2', '=B2*C2'],
    [],
    ...baseHeader
  ]);
  ws3['!cols'] = [{ wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws3, '3 - Fábrica de Controles');

  // 4. Média
  const ws4 = XLSX.utils.aoa_to_sheet([
    ['Robô SENAI', 'Teste 1', 'Teste 2', 'Teste 3', 'Média Final (FÓRMULA)'],
    ['TitanBot-01', 6, 8, 10, 8],
    ['Gabarito', 'Dado 1', 'Dado 2', 'Dado 3', '=MÉDIA(B2:D2)'],
    [],
    ...baseHeader
  ]);
  ws4['!cols'] = [{ wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws4, '4 - Arena das Médias');

  // 5. Desconto
  const ws5 = XLSX.utils.aoa_to_sheet([
    ['Produto', 'Preço Original', 'Taxa Desconto', 'Preço Final (FÓRMULA)'],
    ['Kit Robótica Pro', 200, 0.15, 170],
    ['Gabarito', 'R$ 200,00', '15%', '=B2-(B2*C2) ou =B2*(1-C2)'],
    [],
    ...baseHeader
  ]);
  ws5['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws5, '5 - Chefão dos Descontos');

  // 6. Função SE
  const ws6 = XLSX.utils.aoa_to_sheet([
    ['Peça Calibrada', 'Medição (mm)', 'Cota Mínima', 'Pontuação Bônus (FÓRMULA)'],
    ['Eixo Turbina 01', 75, 50, 100],
    ['Gabarito', '75 mm', '50 mm', '=SE(B2>=C2; 100; 0)'],
    [],
    ...baseHeader
  ]);
  ws6['!cols'] = [{ wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws6, '6 - Inspeção Condicional');

  // 7. Função MÁXIMO
  const ws7 = XLSX.utils.aoa_to_sheet([
    ['Posto de Recarga', 'Bateria A', 'Bateria B', 'Bateria C', 'Pico de Carga (FÓRMULA)'],
    ['Doca Norte', 45, 92, 67, 92],
    ['Gabarito', '45 kWh', '92 kWh', '67 kWh', '=MÁXIMO(B2:D2)'],
    [],
    ...baseHeader
  ]);
  ws7['!cols'] = [{ wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws7, '7 - Usina de Força');

  // 8. Função MÍNIMO
  const ws8 = XLSX.utils.aoa_to_sheet([
    ['Bancada Metrologia', 'Sensor A', 'Sensor B', 'Sensor C', 'Menor Ruído (FÓRMULA)'],
    ['Teste Acústico', 18, 42, 9, 9],
    ['Gabarito', '18 dB', '42 dB', '9 dB', '=MÍNIMO(B2:D2)'],
    [],
    ...baseHeader
  ]);
  ws8['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, ws8, '8 - Lab de Tolerâncias');

  // 9. Função CONT.SE
  const ws9 = XLSX.utils.aoa_to_sheet([
    ['Setor Robótica', 'Lote 101', 'Lote 102', 'Lote 103', 'Lotes Aprovados (FÓRMULA)'],
    ['Pontuação', 65, 30, 85, 2],
    ['Gabarito', '65', '30', '85', '=CONT.SE(B2:D2; ">=50")'],
    [],
    ...baseHeader
  ]);
  ws9['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws9, '9 - Almoxarifado Sensores');

  // 10. Supercomputador Central
  const ws10 = XLSX.utils.aoa_to_sheet([
    ['Fábrica 4.0', 'Peças Linha 1', 'Peças Linha 2', 'Qtd de Linhas', 'Média por Linha (FÓRMULA)'],
    ['Produção Total', 300, 200, 2, 250],
    ['Gabarito', '300', '200', '2', '=(B2+C2)/D2'],
    [],
    ...baseHeader
  ]);
  ws10['!cols'] = [{ wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, ws10, '10 - Supercomputador Central');

  XLSX.writeFile(wb, 'GABARITO_OFICIAL_PROFESSOR_SENAI_10FASES.xlsx');
}
