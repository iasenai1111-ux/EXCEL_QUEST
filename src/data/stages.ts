import { StageDefinition, Medal, StageQuestion } from '../types/game';

// Helper to generate stages with progressive questions (Stage N has N questions)
export const LEVEL_1_STAGES: StageDefinition[] = [
  // FASE 1: 1 Questão (D2)
  {
    id: 1,
    title: 'Fase 1 — Mercado das Somas',
    subtitle: '1 Questão • Adição e função SOMA',
    theme: 'market',
    accentColor: '#38bdf8',
    bgGradient: 'from-slate-900 via-sky-950 to-slate-900',
    learningGoal: 'Aprender a somar valores no Excel usando o operador + e a função =SOMA()',
    storyIntro: 'Ajude o SENAIZINHO no Mercado das Fórmulas a totalizar o estoque de parafusos da primeira linha!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 120, y: 150 },
    grid: {
      columns: ['A', 'B', 'C', 'D'],
      rows: [1, 2, 3],
      cells: {
        'A1': { value: 'Item', type: 'label' },
        'B1': { value: 'Caixa 1', type: 'label' },
        'C1': { value: 'Caixa 2', type: 'label' },
        'D1': { value: 'Total Itens', type: 'label' },
        'A2': { value: 'Parafusos', type: 'label' },
        'B2': { value: 120, type: 'number' },
        'C2': { value: 80, type: 'number' },
        'D2': { value: '?', type: 'editable' },
        'A3': { value: 'Status', type: 'label' },
        'B3': { value: 'Pronto', type: 'label' },
        'C3': { value: 'Pronto', type: 'label' },
        'D3': { value: 'Aguardando', type: 'label' },
      }
    },
    challenge: {
      targetCell: 'D2',
      expectedValue: 200,
      instruction: 'Some os 120 parafusos da Caixa 1 (B2) com os 80 parafusos da Caixa 2 (C2) na célula D2.',
      operationName: 'Adição / SOMA',
      acceptedFormulasDescription: '=B2+C2 ou =SOMA(B2:C2)',
      allowedFunctions: ['SOMA', 'SUM'],
      requiredCells: ['B2', 'C2'],
      hints: [
        'Dica Conceitual: Toda fórmula no Excel inicia com =. Para somar, você pode usar o operador + ou a função =SOMA().',
        'Dica de Células: Preste atenção nas células B2 (120) e C2 (80). Digite =B2+C2 na célula D2.',
        'Exemplo Guiado: Clique em D2, digite =B2+C2 e aperte ENTER para obter 200!'
      ],
      questions: [
        {
          questionIndex: 1,
          targetCell: 'D2',
          expectedValue: 200,
          instruction: 'Some os 120 parafusos (B2) com os 80 parafusos (C2) na célula D2.',
          operationName: 'Adição / SOMA',
          acceptedFormulasDescription: '=B2+C2 ou =SOMA(B2:C2)',
          requiredCells: ['B2', 'C2'],
          hints: [
            'Dica: Inicie com = e some B2 com C2.',
            'Células: B2 e C2.',
            'Exemplo: =B2+C2'
          ]
        }
      ],
      realExcelInstructions: {
        sheetName: '1 - Mercado das Somas',
        sheetIndex: 0,
        cellsToFill: 'D2',
        expectedResultText: '200',
        description: 'Abra a primeira aba, selecione a célula amarela D2 e insira =B2+C2.'
      }
    }
  },

  // FASE 2: 2 Questões (D2 e D3)
  {
    id: 2,
    title: 'Fase 2 — Depósito Perdido',
    subtitle: '2 Questões • Subtração de Saldos',
    theme: 'warehouse',
    accentColor: '#34d399',
    bgGradient: 'from-slate-900 via-emerald-950 to-slate-900',
    learningGoal: 'Aprender a subtrair no Excel usando o operador aritmético de subtração (-)',
    storyIntro: 'O SENAIZINHO precisa calcular o saldo de 2 equipamentos de automação retirados do depósito!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 260, y: 190 },
    grid: {
      columns: ['A', 'B', 'C', 'D'],
      rows: [1, 2, 3],
      cells: {
        'A1': { value: 'Equipamento', type: 'label' },
        'B1': { value: 'Estoque Inicial', type: 'label' },
        'C1': { value: 'Peças Retiradas', type: 'label' },
        'D1': { value: 'Saldo Atual', type: 'label' },
        'A2': { value: 'Sensores Fotoelétricos', type: 'label' },
        'B2': { value: 19, type: 'number' },
        'C2': { value: 7, type: 'number' },
        'D2': { value: '?', type: 'editable' },
        'A3': { value: 'Relés Temporizados', type: 'label' },
        'B3': { value: 25, type: 'number' },
        'C3': { value: 10, type: 'number' },
        'D3': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'D2',
      expectedValue: 12,
      instruction: 'Resolva as 2 questões de subtração: D2 (19 - 7) e D3 (25 - 10).',
      operationName: 'Subtração',
      acceptedFormulasDescription: '=B2-C2 e =B3-C3',
      allowedFunctions: [],
      requiredCells: ['B2', 'C2'],
      hints: [
        'Dica Conceitual: Use o sinal de menos (-) para subtrair: =B2-C2 na linha 2 e =B3-C3 na linha 3.',
        'Dica de Células: Na primeira questão subtraia C2 de B2. Na segunda, subtraia C3 de B3.',
        'Exemplo Guiado: Digite =B2-C2 na célula D2 e depois =B3-C3 na célula D3.'
      ],
      questions: [
        {
          questionIndex: 1,
          targetCell: 'D2',
          expectedValue: 12,
          instruction: 'Questão 1/2: Subtraia as peças retiradas (C2) do estoque (B2) na célula D2.',
          operationName: 'Subtração',
          acceptedFormulasDescription: '=B2-C2',
          requiredCells: ['B2', 'C2'],
          hints: ['Inicie com = e subtraia C2 de B2.', 'Fórmula: =B2-C2', 'Digite =B2-C2']
        },
        {
          questionIndex: 2,
          targetCell: 'D3',
          expectedValue: 15,
          instruction: 'Questão 2/2: Subtraia as 10 peças (C3) do estoque de 25 (B3) na célula D3.',
          operationName: 'Subtração',
          acceptedFormulasDescription: '=B3-C3',
          requiredCells: ['B3', 'C3'],
          hints: ['Subtraia C3 de B3.', 'Fórmula: =B3-C3', 'Digite =B3-C3']
        }
      ],
      realExcelInstructions: {
        sheetName: '2 - Depósito Perdido',
        sheetIndex: 1,
        cellsToFill: 'D2 e D3',
        expectedResultText: '12 e 15',
        description: 'Na aba "2 - Depósito Perdido", preencha D2 com =B2-C2 e D3 com =B3-C3.'
      }
    }
  },

  // FASE 3: 3 Questões (D2, D3, D4)
  {
    id: 3,
    title: 'Fase 3 — Fábrica de Controles',
    subtitle: '3 Questões • Multiplicação Industrial (*)',
    theme: 'factory',
    accentColor: '#fb923c',
    bgGradient: 'from-slate-900 via-amber-950 to-slate-900',
    learningGoal: 'Aprender a multiplicar no Excel utilizando o caractere asterisco (*)',
    storyIntro: 'O SENAIZINHO precisa calcular a produção das 3 linhas automatizadas da fábrica!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 400, y: 140 },
    grid: {
      columns: ['A', 'B', 'C', 'D'],
      rows: [1, 2, 3, 4],
      cells: {
        'A1': { value: 'Linha', type: 'label' },
        'B1': { value: 'Lotes', type: 'label' },
        'C1': { value: 'Placas/Lote', type: 'label' },
        'D1': { value: 'Produção Total', type: 'label' },
        'A2': { value: 'Linha Alfa', type: 'label' },
        'B2': { value: 6, type: 'number' },
        'C2': { value: 45, type: 'number' },
        'D2': { value: '?', type: 'editable' },
        'A3': { value: 'Linha Beta', type: 'label' },
        'B3': { value: 4, type: 'number' },
        'C3': { value: 30, type: 'number' },
        'D3': { value: '?', type: 'editable' },
        'A4': { value: 'Linha Gama', type: 'label' },
        'B4': { value: 8, type: 'number' },
        'C4': { value: 15, type: 'number' },
        'D4': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'D2',
      expectedValue: 270,
      instruction: 'Calcule a produção das 3 linhas multiplicando lotes por placas: D2, D3 e D4.',
      operationName: 'Multiplicação (*)',
      acceptedFormulasDescription: '=B2*C2, =B3*C3 e =B4*C4',
      allowedFunctions: ['MULT', 'PRODUCT'],
      requiredCells: ['B2', 'C2'],
      hints: [
        'Dica: Use o asterisco (*) para multiplicar.',
        'Linhas: =B2*C2 na linha 2, =B3*C3 na linha 3 e =B4*C4 na linha 4.',
        'Exemplo: Preencha cada célula com sua respectiva multiplicação.'
      ],
      questions: [
        {
          questionIndex: 1,
          targetCell: 'D2',
          expectedValue: 270,
          instruction: 'Questão 1/3: Multiplique 6 lotes (B2) por 45 placas (C2) na célula D2.',
          operationName: 'Multiplicação (*)',
          acceptedFormulasDescription: '=B2*C2',
          requiredCells: ['B2', 'C2'],
          hints: ['Multiplique B2 por C2 com *.', '=B2*C2', 'Digite =B2*C2']
        },
        {
          questionIndex: 2,
          targetCell: 'D3',
          expectedValue: 120,
          instruction: 'Questão 2/3: Multiplique 4 lotes (B3) por 30 placas (C3) na célula D3.',
          operationName: 'Multiplicação (*)',
          acceptedFormulasDescription: '=B3*C3',
          requiredCells: ['B3', 'C3'],
          hints: ['Multiplique B3 por C3.', '=B3*C3', 'Digite =B3*C3']
        },
        {
          questionIndex: 3,
          targetCell: 'D4',
          expectedValue: 120,
          instruction: 'Questão 3/3: Multiplique 8 lotes (B4) por 15 placas (C4) na célula D4.',
          operationName: 'Multiplicação (*)',
          acceptedFormulasDescription: '=B4*C4',
          requiredCells: ['B4', 'C4'],
          hints: ['Multiplique B4 por C4.', '=B4*C4', 'Digite =B4*C4']
        }
      ],
      realExcelInstructions: {
        sheetName: '3 - Fábrica de Controles',
        sheetIndex: 2,
        cellsToFill: 'D2, D3 e D4',
        expectedResultText: '270, 120 e 120',
        description: 'Na aba 3, preencha as 3 células amarelas com as multiplicações correspondentes.'
      }
    }
  },

  // FASE 4: 4 Questões (E2, E3, E4, E5)
  {
    id: 4,
    title: 'Fase 4 — Arena das Médias',
    subtitle: '4 Questões • Função MÉDIA',
    theme: 'arena',
    accentColor: '#a855f7',
    bgGradient: 'from-slate-900 via-purple-950 to-slate-900',
    learningGoal: 'Aprender a calcular a média aritmética usando a função =MÉDIA() com intervalo',
    storyIntro: 'Avalie o desempenho dos 4 robôs da equipe de mecatrônica do SENAI calculando as 4 médias!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 540, y: 180 },
    grid: {
      columns: ['A', 'B', 'C', 'D', 'E'],
      rows: [1, 2, 3, 4, 5],
      cells: {
        'A1': { value: 'Robô SENAI', type: 'label' },
        'B1': { value: 'Teste 1', type: 'label' },
        'C1': { value: 'Teste 2', type: 'label' },
        'D1': { value: 'Teste 3', type: 'label' },
        'E1': { value: 'Média Final', type: 'label' },
        'A2': { value: 'TitanBot-01', type: 'label' },
        'B2': { value: 6, type: 'number' },
        'C2': { value: 8, type: 'number' },
        'D2': { value: 10, type: 'number' },
        'E2': { value: '?', type: 'editable' },
        'A3': { value: 'CyberBot-02', type: 'label' },
        'B3': { value: 7, type: 'number' },
        'C3': { value: 9, type: 'number' },
        'D3': { value: 8, type: 'number' },
        'E3': { value: '?', type: 'editable' },
        'A4': { value: 'RoboMax-03', type: 'label' },
        'B4': { value: 10, type: 'number' },
        'C4': { value: 10, type: 'number' },
        'D4': { value: 10, type: 'number' },
        'E4': { value: '?', type: 'editable' },
        'A5': { value: 'AeroBot-04', type: 'label' },
        'B5': { value: 5, type: 'number' },
        'C5': { value: 7, type: 'number' },
        'D5': { value: 6, type: 'number' },
        'E5': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'E2',
      expectedValue: 8,
      instruction: 'Calcule a média aritmética dos 4 robôs nas células E2, E3, E4 e E5.',
      operationName: 'Função MÉDIA',
      acceptedFormulasDescription: '=MÉDIA(B2:D2) até =MÉDIA(B5:D5)',
      allowedFunctions: ['MÉDIA', 'MEDIA', 'AVERAGE'],
      requiredCells: ['B2', 'D2'],
      hints: [
        'Dica: Use =MÉDIA(início:fim) para cada linha.',
        'Intervalos: B2:D2, B3:D3, B4:D4 e B5:D5.',
        'Exemplo: =MÉDIA(B2:D2)'
      ],
      questions: [
        {
          questionIndex: 1,
          targetCell: 'E2',
          expectedValue: 8,
          instruction: 'Questão 1/4: Média do TitanBot-01 em E2 com =MÉDIA(B2:D2).',
          operationName: 'Função MÉDIA',
          acceptedFormulasDescription: '=MÉDIA(B2:D2)',
          requiredCells: ['B2', 'D2'],
          hints: ['=MÉDIA(B2:D2)', 'Intervalo B2 até D2', 'Digite =MÉDIA(B2:D2)']
        },
        {
          questionIndex: 2,
          targetCell: 'E3',
          expectedValue: 8,
          instruction: 'Questão 2/4: Média do CyberBot-02 em E3 com =MÉDIA(B3:D3).',
          operationName: 'Função MÉDIA',
          acceptedFormulasDescription: '=MÉDIA(B3:D3)',
          requiredCells: ['B3', 'D3'],
          hints: ['=MÉDIA(B3:D3)', 'Intervalo B3 até D3', 'Digite =MÉDIA(B3:D3)']
        },
        {
          questionIndex: 3,
          targetCell: 'E4',
          expectedValue: 10,
          instruction: 'Questão 3/4: Média do RoboMax-03 em E4 com =MÉDIA(B4:D4).',
          operationName: 'Função MÉDIA',
          acceptedFormulasDescription: '=MÉDIA(B4:D4)',
          requiredCells: ['B4', 'D4'],
          hints: ['=MÉDIA(B4:D4)', 'Intervalo B4 até D4', 'Digite =MÉDIA(B4:D4)']
        },
        {
          questionIndex: 4,
          targetCell: 'E5',
          expectedValue: 6,
          instruction: 'Questão 4/4: Média do AeroBot-04 em E5 com =MÉDIA(B5:D5).',
          operationName: 'Função MÉDIA',
          acceptedFormulasDescription: '=MÉDIA(B5:D5)',
          requiredCells: ['B5', 'D5'],
          hints: ['=MÉDIA(B5:D5)', 'Intervalo B5 até D5', 'Digite =MÉDIA(B5:D5)']
        }
      ],
      realExcelInstructions: {
        sheetName: '4 - Arena das Médias',
        sheetIndex: 3,
        cellsToFill: 'E2 até E5',
        expectedResultText: '8, 8, 10, 6',
        description: 'Na aba 4, preencha as 4 células amarelas da coluna E com a função MÉDIA.'
      }
    }
  },

  // FASE 5: 5 Questões (D2, D3, D4, D5, D6)
  {
    id: 5,
    title: 'Fase 5 — Chefão dos Descontos',
    subtitle: '5 Questões • Cálculo de Porcentagem (%)',
    theme: 'boss',
    accentColor: '#f43f5e',
    bgGradient: 'from-slate-900 via-rose-950 to-slate-900',
    learningGoal: 'Aprender a calcular porcentagem e valor líquido com desconto no Excel',
    storyIntro: 'O Chefão dos Descontos desafia o SENAIZINHO com 5 itens promocionais do catálogo industrial!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 680, y: 150 },
    grid: {
      columns: ['A', 'B', 'C', 'D'],
      rows: [1, 2, 3, 4, 5, 6],
      cells: {
        'A1': { value: 'Produto', type: 'label' },
        'B1': { value: 'Preço Original', type: 'label' },
        'C1': { value: 'Desconto', type: 'label' },
        'D1': { value: 'Preço Final', type: 'label' },
        'A2': { value: 'Kit Robótica Pro', type: 'label' },
        'B2': { value: 200, type: 'number' },
        'C2': { value: 0.15, type: 'percent', format: '15%' },
        'D2': { value: '?', type: 'editable' },
        'A3': { value: 'Multímetro Digital', type: 'label' },
        'B3': { value: 100, type: 'number' },
        'C3': { value: 0.10, type: 'percent', format: '10%' },
        'D3': { value: '?', type: 'editable' },
        'A4': { value: 'Bancada Didática', type: 'label' },
        'B4': { value: 300, type: 'number' },
        'C4': { value: 0.20, type: 'percent', format: '20%' },
        'D4': { value: '?', type: 'editable' },
        'A5': { value: 'Alicate Amperímetro', type: 'label' },
        'B5': { value: 50, type: 'number' },
        'C5': { value: 0.10, type: 'percent', format: '10%' },
        'D5': { value: '?', type: 'editable' },
        'A6': { value: 'Osciloscópio USB', type: 'label' },
        'B6': { value: 400, type: 'number' },
        'C6': { value: 0.25, type: 'percent', format: '25%' },
        'D6': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'D2',
      expectedValue: 170,
      instruction: 'Calcule o preço líquido dos 5 produtos: D2, D3, D4, D5 e D6.',
      operationName: 'Cálculo de Porcentagem (%)',
      acceptedFormulasDescription: '=B2-(B2*C2) até =B6-(B6*C6)',
      allowedFunctions: [],
      requiredCells: ['B2', 'C2'],
      hints: [
        'Dica: O preço com desconto é =Preço-(Preço*Desconto), ex: =B2-(B2*C2).',
        'Alternativa: Você também pode usar =B2*(1-C2).',
        'Exemplo: Preencha cada linha com o respectivo desconto.'
      ],
      questions: [
        { questionIndex: 1, targetCell: 'D2', expectedValue: 170, instruction: 'Questão 1/5: Preço final de B2 com 15% de desconto em D2.', operationName: 'Porcentagem', acceptedFormulasDescription: '=B2-(B2*C2)', requiredCells: ['B2', 'C2'], hints: ['=B2-(B2*C2)', 'B2 com desconto C2', 'Digite =B2-(B2*C2)'] },
        { questionIndex: 2, targetCell: 'D3', expectedValue: 90, instruction: 'Questão 2/5: Preço final de B3 (100) com 10% de desconto em D3.', operationName: 'Porcentagem', acceptedFormulasDescription: '=B3-(B3*C3)', requiredCells: ['B3', 'C3'], hints: ['=B3-(B3*C3)', '100 - 10%', 'Digite =B3-(B3*C3)'] },
        { questionIndex: 3, targetCell: 'D4', expectedValue: 240, instruction: 'Questão 3/5: Preço final de B4 (300) com 20% de desconto em D4.', operationName: 'Porcentagem', acceptedFormulasDescription: '=B4-(B4*C4)', requiredCells: ['B4', 'C4'], hints: ['=B4-(B4*C4)', '300 - 20%', 'Digite =B4-(B4*C4)'] },
        { questionIndex: 4, targetCell: 'D5', expectedValue: 45, instruction: 'Questão 4/5: Preço final de B5 (50) com 10% de desconto em D5.', operationName: 'Porcentagem', acceptedFormulasDescription: '=B5-(B5*C5)', requiredCells: ['B5', 'C5'], hints: ['=B5-(B5*C5)', '50 - 10%', 'Digite =B5-(B5*C5)'] },
        { questionIndex: 5, targetCell: 'D6', expectedValue: 300, instruction: 'Questão 5/5: Preço final de B6 (400) com 25% de desconto em D6.', operationName: 'Porcentagem', acceptedFormulasDescription: '=B6-(B6*C6)', requiredCells: ['B6', 'C6'], hints: ['=B6-(B6*C6)', '400 - 25%', 'Digite =B6-(B6*C6)'] }
      ],
      realExcelInstructions: {
        sheetName: '5 - Chefão dos Descontos',
        sheetIndex: 4,
        cellsToFill: 'D2 até D6',
        expectedResultText: '170, 90, 240, 45, 300',
        description: 'Na aba 5, preencha as 5 células amarelas de D2 a D6.'
      }
    }
  },

  // FASE 6: 6 Questões (D2, D3, D4, D5, D6, D7) - Função SE
  {
    id: 6,
    title: 'Fase 6 — Inspeção Condicional',
    subtitle: '6 Questões • Função Lógica SE',
    theme: 'warehouse',
    accentColor: '#06b6d4',
    bgGradient: 'from-slate-900 via-cyan-950 to-slate-900',
    learningGoal: 'Compreender a tomada de decisão lógica no Excel utilizando a função =SE()',
    storyIntro: 'O SENAIZINHO inspeciona 6 eixos calibrados: se a medição B >= 50, atribui 100 pontos, senão 0!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 180, y: 320 },
    grid: {
      columns: ['A', 'B', 'C', 'D'],
      rows: [1, 2, 3, 4, 5, 6, 7],
      cells: {
        'A1': { value: 'Peça Calibrada', type: 'label' },
        'B1': { value: 'Medição (mm)', type: 'label' },
        'C1': { value: 'Cota Mínima', type: 'label' },
        'D1': { value: 'Pontuação Bônus', type: 'label' },
        'A2': { value: 'Eixo Turbina 01', type: 'label' }, 'B2': { value: 75, type: 'number' }, 'C2': { value: 50, type: 'number' }, 'D2': { value: '?', type: 'editable' },
        'A3': { value: 'Eixo Turbina 02', type: 'label' }, 'B3': { value: 40, type: 'number' }, 'C3': { value: 50, type: 'number' }, 'D3': { value: '?', type: 'editable' },
        'A4': { value: 'Eixo Turbina 03', type: 'label' }, 'B4': { value: 90, type: 'number' }, 'C4': { value: 50, type: 'number' }, 'D4': { value: '?', type: 'editable' },
        'A5': { value: 'Eixo Turbina 04', type: 'label' }, 'B5': { value: 50, type: 'number' }, 'C5': { value: 50, type: 'number' }, 'D5': { value: '?', type: 'editable' },
        'A6': { value: 'Eixo Turbina 05', type: 'label' }, 'B6': { value: 25, type: 'number' }, 'C6': { value: 50, type: 'number' }, 'D6': { value: '?', type: 'editable' },
        'A7': { value: 'Eixo Turbina 06', type: 'label' }, 'B7': { value: 80, type: 'number' }, 'C7': { value: 50, type: 'number' }, 'D7': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'D2',
      expectedValue: 100,
      instruction: 'Aplique a função SE nas 6 peças: se medição >= 50, bônus 100, senão 0.',
      operationName: 'Função Lógica =SE()',
      acceptedFormulasDescription: '=SE(B2>=50; 100; 0) até =SE(B7>=50; 100; 0)',
      allowedFunctions: ['SE', 'IF'],
      requiredCells: ['B2'],
      hints: [
        'Dica: =SE(teste; se_verdadeiro; se_falso).',
        'Fórmula: =SE(B2>=50; 100; 0) na linha 2, =SE(B3>=50; 100; 0) na linha 3, etc.',
        'Exemplo: Digite a fórmula condicional em cada célula.'
      ],
      questions: [
        { questionIndex: 1, targetCell: 'D2', expectedValue: 100, instruction: 'Q1/6: =SE(B2>=50; 100; 0) em D2.', operationName: 'SE', acceptedFormulasDescription: '=SE(B2>=50; 100; 0)', requiredCells: ['B2'], hints: ['=SE(B2>=50; 100; 0)', 'B2>=50', 'Digite =SE(B2>=50; 100; 0)'] },
        { questionIndex: 2, targetCell: 'D3', expectedValue: 0, instruction: 'Q2/6: =SE(B3>=50; 100; 0) em D3.', operationName: 'SE', acceptedFormulasDescription: '=SE(B3>=50; 100; 0)', requiredCells: ['B3'], hints: ['=SE(B3>=50; 100; 0)', 'B3>=50', 'Digite =SE(B3>=50; 100; 0)'] },
        { questionIndex: 3, targetCell: 'D4', expectedValue: 100, instruction: 'Q3/6: =SE(B4>=50; 100; 0) em D4.', operationName: 'SE', acceptedFormulasDescription: '=SE(B4>=50; 100; 0)', requiredCells: ['B4'], hints: ['=SE(B4>=50; 100; 0)', 'B4>=50', 'Digite =SE(B4>=50; 100; 0)'] },
        { questionIndex: 4, targetCell: 'D5', expectedValue: 100, instruction: 'Q4/6: =SE(B5>=50; 100; 0) em D5.', operationName: 'SE', acceptedFormulasDescription: '=SE(B5>=50; 100; 0)', requiredCells: ['B5'], hints: ['=SE(B5>=50; 100; 0)', 'B5>=50', 'Digite =SE(B5>=50; 100; 0)'] },
        { questionIndex: 5, targetCell: 'D6', expectedValue: 0, instruction: 'Q5/6: =SE(B6>=50; 100; 0) em D6.', operationName: 'SE', acceptedFormulasDescription: '=SE(B6>=50; 100; 0)', requiredCells: ['B6'], hints: ['=SE(B6>=50; 100; 0)', 'B6>=50', 'Digite =SE(B6>=50; 100; 0)'] },
        { questionIndex: 6, targetCell: 'D7', expectedValue: 100, instruction: 'Q6/6: =SE(B7>=50; 100; 0) em D7.', operationName: 'SE', acceptedFormulasDescription: '=SE(B7>=50; 100; 0)', requiredCells: ['B7'], hints: ['=SE(B7>=50; 100; 0)', 'B7>=50', 'Digite =SE(B7>=50; 100; 0)'] }
      ],
      realExcelInstructions: {
        sheetName: '6 - Inspeção Condicional',
        sheetIndex: 5,
        cellsToFill: 'D2 até D7',
        expectedResultText: '100, 0, 100, 100, 0, 100',
        description: 'Na aba 6, preencha as 6 células amarelas com a função SE.'
      }
    }
  },

  // FASE 7: 7 Questões (E2 a E8) - Função MÁXIMO
  {
    id: 7,
    title: 'Fase 7 — Usina Elétrica',
    subtitle: '7 Questões • Função MÁXIMO',
    theme: 'factory',
    accentColor: '#eab308',
    bgGradient: 'from-slate-900 via-yellow-950 to-slate-900',
    learningGoal: 'Aprender a localizar o maior valor com =MÁXIMO()',
    storyIntro: 'O SENAIZINHO precisa encontrar o pico de rotação em 7 bancadas geradoras de energia!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 380, y: 340 },
    grid: {
      columns: ['A', 'B', 'C', 'D', 'E'],
      rows: [1, 2, 3, 4, 5, 6, 7, 8],
      cells: {
        'A1': { value: 'Bancada', type: 'label' }, 'B1': { value: 'G1', type: 'label' }, 'C1': { value: 'G2', type: 'label' }, 'D1': { value: 'G3', type: 'label' }, 'E1': { value: 'Pico Máximo', type: 'label' },
        'A2': { value: 'Setor A1', type: 'label' }, 'B2': { value: 1450, type: 'number' }, 'C2': { value: 3200, type: 'number' }, 'D2': { value: 2800, type: 'number' }, 'E2': { value: '?', type: 'editable' },
        'A3': { value: 'Setor A2', type: 'label' }, 'B3': { value: 2100, type: 'number' }, 'C3': { value: 1800, type: 'number' }, 'D3': { value: 2900, type: 'number' }, 'E3': { value: '?', type: 'editable' },
        'A4': { value: 'Setor A3', type: 'label' }, 'B4': { value: 3500, type: 'number' }, 'C4': { value: 2200, type: 'number' }, 'D4': { value: 3100, type: 'number' }, 'E4': { value: '?', type: 'editable' },
        'A5': { value: 'Setor A4', type: 'label' }, 'B5': { value: 1900, type: 'number' }, 'C5': { value: 2400, type: 'number' }, 'D5': { value: 1600, type: 'number' }, 'E5': { value: '?', type: 'editable' },
        'A6': { value: 'Setor A5', type: 'label' }, 'B6': { value: 4100, type: 'number' }, 'C6': { value: 3800, type: 'number' }, 'D6': { value: 4000, type: 'number' }, 'E6': { value: '?', type: 'editable' },
        'A7': { value: 'Setor A6', type: 'label' }, 'B7': { value: 2600, type: 'number' }, 'C7': { value: 2750, type: 'number' }, 'D7': { value: 2500, type: 'number' }, 'E7': { value: '?', type: 'editable' },
        'A8': { value: 'Setor A7', type: 'label' }, 'B8': { value: 3300, type: 'number' }, 'C8': { value: 3450, type: 'number' }, 'D8': { value: 3200, type: 'number' }, 'E8': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'E2',
      expectedValue: 3200,
      instruction: 'Encontre o valor máximo de cada uma das 7 bancadas com =MÁXIMO(B2:D2) até E8.',
      operationName: 'Função =MÁXIMO()',
      acceptedFormulasDescription: '=MÁXIMO(B2:D2) até =MÁXIMO(B8:D8)',
      allowedFunctions: ['MÁXIMO', 'MAXIMO', 'MAX'],
      requiredCells: ['B2', 'D2'],
      hints: ['=MÁXIMO(B2:D2)', 'Identifica o maior valor da linha.', 'Digite =MÁXIMO(B2:D2)'],
      questions: [
        { questionIndex: 1, targetCell: 'E2', expectedValue: 3200, instruction: 'Q1/7: =MÁXIMO(B2:D2) em E2.', operationName: 'MÁXIMO', acceptedFormulasDescription: '=MÁXIMO(B2:D2)', requiredCells: ['B2', 'D2'], hints: ['=MÁXIMO(B2:D2)', 'B2:D2', 'Digite =MÁXIMO(B2:D2)'] },
        { questionIndex: 2, targetCell: 'E3', expectedValue: 2900, instruction: 'Q2/7: =MÁXIMO(B3:D3) em E3.', operationName: 'MÁXIMO', acceptedFormulasDescription: '=MÁXIMO(B3:D3)', requiredCells: ['B3', 'D3'], hints: ['=MÁXIMO(B3:D3)', 'B3:D3', 'Digite =MÁXIMO(B3:D3)'] },
        { questionIndex: 3, targetCell: 'E4', expectedValue: 3500, instruction: 'Q3/7: =MÁXIMO(B4:D4) em E4.', operationName: 'MÁXIMO', acceptedFormulasDescription: '=MÁXIMO(B4:D4)', requiredCells: ['B4', 'D4'], hints: ['=MÁXIMO(B4:D4)', 'B4:D4', 'Digite =MÁXIMO(B4:D4)'] },
        { questionIndex: 4, targetCell: 'E5', expectedValue: 2400, instruction: 'Q4/7: =MÁXIMO(B5:D5) em E5.', operationName: 'MÁXIMO', acceptedFormulasDescription: '=MÁXIMO(B5:D5)', requiredCells: ['B5', 'D5'], hints: ['=MÁXIMO(B5:D5)', 'B5:D5', 'Digite =MÁXIMO(B5:D5)'] },
        { questionIndex: 5, targetCell: 'E6', expectedValue: 4100, instruction: 'Q5/7: =MÁXIMO(B6:D6) em E6.', operationName: 'MÁXIMO', acceptedFormulasDescription: '=MÁXIMO(B6:D6)', requiredCells: ['B6', 'D6'], hints: ['=MÁXIMO(B6:D6)', 'B6:D6', 'Digite =MÁXIMO(B6:D6)'] },
        { questionIndex: 6, targetCell: 'E7', expectedValue: 2750, instruction: 'Q6/7: =MÁXIMO(B7:D7) em E7.', operationName: 'MÁXIMO', acceptedFormulasDescription: '=MÁXIMO(B7:D7)', requiredCells: ['B7', 'D7'], hints: ['=MÁXIMO(B7:D7)', 'B7:D7', 'Digite =MÁXIMO(B7:D7)'] },
        { questionIndex: 7, targetCell: 'E8', expectedValue: 3450, instruction: 'Q7/7: =MÁXIMO(B8:D8) em E8.', operationName: 'MÁXIMO', acceptedFormulasDescription: '=MÁXIMO(B8:D8)', requiredCells: ['B8', 'D8'], hints: ['=MÁXIMO(B8:D8)', 'B8:D8', 'Digite =MÁXIMO(B8:D8)'] },
      ],
      realExcelInstructions: {
        sheetName: '7 - Usina Elétrica',
        sheetIndex: 6,
        cellsToFill: 'E2 até E8',
        expectedResultText: '3200, 2900, 3500, 2400, 4100, 2750, 3450',
        description: 'Na aba 7, preencha as 7 células da coluna E com a função MÁXIMO.'
      }
    }
  },

  // FASE 8: 8 Questões (E2 a E9) - Função MÍNIMO
  {
    id: 8,
    title: 'Fase 8 — Laboratório de Tolerâncias',
    subtitle: '8 Questões • Função MÍNIMO',
    theme: 'market',
    accentColor: '#14b8a6',
    bgGradient: 'from-slate-900 via-teal-950 to-slate-900',
    learningGoal: 'Aprender a identificar o menor valor com =MÍNIMO()',
    storyIntro: 'O SENAIZINHO analisa 8 bancadas acústicas para aferir a menor tolerância de ruído!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 580, y: 310 },
    grid: {
      columns: ['A', 'B', 'C', 'D', 'E'],
      rows: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      cells: {
        'A1': { value: 'Bancada', type: 'label' }, 'B1': { value: 'S1', type: 'label' }, 'C1': { value: 'S2', type: 'label' }, 'D1': { value: 'S3', type: 'label' }, 'E1': { value: 'Menor Ruído', type: 'label' },
        'A2': { value: 'Bancada 1', type: 'label' }, 'B2': { value: 18, type: 'number' }, 'C2': { value: 42, type: 'number' }, 'D2': { value: 9, type: 'number' }, 'E2': { value: '?', type: 'editable' },
        'A3': { value: 'Bancada 2', type: 'label' }, 'B3': { value: 25, type: 'number' }, 'C3': { value: 14, type: 'number' }, 'D3': { value: 30, type: 'number' }, 'E3': { value: '?', type: 'editable' },
        'A4': { value: 'Bancada 3', type: 'label' }, 'B4': { value: 40, type: 'number' }, 'C4': { value: 12, type: 'number' }, 'D4': { value: 15, type: 'number' }, 'E4': { value: '?', type: 'editable' },
        'A5': { value: 'Bancada 4', type: 'label' }, 'B5': { value: 33, type: 'number' }, 'C5': { value: 27, type: 'number' }, 'D5': { value: 8, type: 'number' }, 'E5': { value: '?', type: 'editable' },
        'A6': { value: 'Bancada 5', type: 'label' }, 'B6': { value: 19, type: 'number' }, 'C6': { value: 11, type: 'number' }, 'D6': { value: 22, type: 'number' }, 'E6': { value: '?', type: 'editable' },
        'A7': { value: 'Bancada 6', type: 'label' }, 'B7': { value: 50, type: 'number' }, 'C7': { value: 35, type: 'number' }, 'D7': { value: 16, type: 'number' }, 'E7': { value: '?', type: 'editable' },
        'A8': { value: 'Bancada 7', type: 'label' }, 'B8': { value: 28, type: 'number' }, 'C8': { value: 20, type: 'number' }, 'D8': { value: 5, type: 'number' }, 'E8': { value: '?', type: 'editable' },
        'A9': { value: 'Bancada 8', type: 'label' }, 'B9': { value: 14, type: 'number' }, 'C9': { value: 7, type: 'number' }, 'D9': { value: 19, type: 'number' }, 'E9': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'E2',
      expectedValue: 9,
      instruction: 'Encontre o menor valor das 8 bancadas aplicando =MÍNIMO(B2:D2) até E9.',
      operationName: 'Função =MÍNIMO()',
      acceptedFormulasDescription: '=MÍNIMO(B2:D2) até =MÍNIMO(B9:D9)',
      allowedFunctions: ['MÍNIMO', 'MINIMO', 'MIN'],
      requiredCells: ['B2', 'D2'],
      hints: ['=MÍNIMO(B2:D2)', 'Localiza a menor leitura da linha.', 'Digite =MÍNIMO(B2:D2)'],
      questions: [
        { questionIndex: 1, targetCell: 'E2', expectedValue: 9, instruction: 'Q1/8: =MÍNIMO(B2:D2) em E2.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B2:D2)', requiredCells: ['B2', 'D2'], hints: ['=MÍNIMO(B2:D2)', 'B2:D2', 'Digite =MÍNIMO(B2:D2)'] },
        { questionIndex: 2, targetCell: 'E3', expectedValue: 14, instruction: 'Q2/8: =MÍNIMO(B3:D3) em E3.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B3:D3)', requiredCells: ['B3', 'D3'], hints: ['=MÍNIMO(B3:D3)', 'B3:D3', 'Digite =MÍNIMO(B3:D3)'] },
        { questionIndex: 3, targetCell: 'E4', expectedValue: 12, instruction: 'Q3/8: =MÍNIMO(B4:D4) em E4.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B4:D4)', requiredCells: ['B4', 'D4'], hints: ['=MÍNIMO(B4:D4)', 'B4:D4', 'Digite =MÍNIMO(B4:D4)'] },
        { questionIndex: 4, targetCell: 'E5', expectedValue: 8, instruction: 'Q4/8: =MÍNIMO(B5:D5) em E5.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B5:D5)', requiredCells: ['B5', 'D5'], hints: ['=MÍNIMO(B5:D5)', 'B5:D5', 'Digite =MÍNIMO(B5:D5)'] },
        { questionIndex: 5, targetCell: 'E6', expectedValue: 11, instruction: 'Q5/8: =MÍNIMO(B6:D6) em E6.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B6:D6)', requiredCells: ['B6', 'D6'], hints: ['=MÍNIMO(B6:D6)', 'B6:D6', 'Digite =MÍNIMO(B6:D6)'] },
        { questionIndex: 6, targetCell: 'E7', expectedValue: 16, instruction: 'Q6/8: =MÍNIMO(B7:D7) em E7.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B7:D7)', requiredCells: ['B7', 'D7'], hints: ['=MÍNIMO(B7:D7)', 'B7:D7', 'Digite =MÍNIMO(B7:D7)'] },
        { questionIndex: 7, targetCell: 'E8', expectedValue: 5, instruction: 'Q7/8: =MÍNIMO(B8:D8) em E8.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B8:D8)', requiredCells: ['B8', 'D8'], hints: ['=MÍNIMO(B8:D8)', 'B8:D8', 'Digite =MÍNIMO(B8:D8)'] },
        { questionIndex: 8, targetCell: 'E9', expectedValue: 7, instruction: 'Q8/8: =MÍNIMO(B9:D9) em E9.', operationName: 'MÍNIMO', acceptedFormulasDescription: '=MÍNIMO(B9:D9)', requiredCells: ['B9', 'D9'], hints: ['=MÍNIMO(B9:D9)', 'B9:D9', 'Digite =MÍNIMO(B9:D9)'] },
      ],
      realExcelInstructions: {
        sheetName: '8 - Lab de Tolerâncias',
        sheetIndex: 7,
        cellsToFill: 'E2 até E9',
        expectedResultText: '9, 14, 12, 8, 11, 16, 5, 7',
        description: 'Na aba 8, preencha as 8 células da coluna E com a função MÍNIMO.'
      }
    }
  },

  // FASE 9: 9 Questões (E2 a E10) - Função CONT.SE
  {
    id: 9,
    title: 'Fase 9 — Almoxarifado de Sensores',
    subtitle: '9 Questões • Função CONT.SE',
    theme: 'arena',
    accentColor: '#6366f1',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
    learningGoal: 'Aprender a contar células que atendem a um critério com =CONT.SE()',
    storyIntro: 'O SENAIZINHO automatiza 9 relatórios de inspeção contando sensores com pontuação >= 50!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 740, y: 350 },
    grid: {
      columns: ['A', 'B', 'C', 'D', 'E'],
      rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      cells: {
        'A1': { value: 'Grupo', type: 'label' }, 'B1': { value: 'Lote 1', type: 'label' }, 'C1': { value: 'Lote 2', type: 'label' }, 'D1': { value: 'Lote 3', type: 'label' }, 'E1': { value: 'Aprovados (>=50)', type: 'label' },
        'A2': { value: 'Grupo 01', type: 'label' }, 'B2': { value: 65, type: 'number' }, 'C2': { value: 30, type: 'number' }, 'D2': { value: 85, type: 'number' }, 'E2': { value: '?', type: 'editable' },
        'A3': { value: 'Grupo 02', type: 'label' }, 'B3': { value: 50, type: 'number' }, 'C3': { value: 60, type: 'number' }, 'D3': { value: 70, type: 'number' }, 'E3': { value: '?', type: 'editable' },
        'A4': { value: 'Grupo 03', type: 'label' }, 'B4': { value: 20, type: 'number' }, 'C4': { value: 35, type: 'number' }, 'D4': { value: 40, type: 'number' }, 'E4': { value: '?', type: 'editable' },
        'A5': { value: 'Grupo 04', type: 'label' }, 'B5': { value: 90, type: 'number' }, 'C5': { value: 80, type: 'number' }, 'D5': { value: 25, type: 'number' }, 'E5': { value: '?', type: 'editable' },
        'A6': { value: 'Grupo 05', type: 'label' }, 'B6': { value: 55, type: 'number' }, 'C6': { value: 45, type: 'number' }, 'D6': { value: 60, type: 'number' }, 'E6': { value: '?', type: 'editable' },
        'A7': { value: 'Grupo 06', type: 'label' }, 'B7': { value: 15, type: 'number' }, 'C7': { value: 10, type: 'number' }, 'D7': { value: 75, type: 'number' }, 'E7': { value: '?', type: 'editable' },
        'A8': { value: 'Grupo 07', type: 'label' }, 'B8': { value: 85, type: 'number' }, 'C8': { value: 95, type: 'number' }, 'D8': { value: 50, type: 'number' }, 'E8': { value: '?', type: 'editable' },
        'A9': { value: 'Grupo 08', type: 'label' }, 'B9': { value: 30, type: 'number' }, 'C9': { value: 40, type: 'number' }, 'D9': { value: 20, type: 'number' }, 'E9': { value: '?', type: 'editable' },
        'A10': { value: 'Grupo 09', type: 'label' }, 'B10': { value: 60, type: 'number' }, 'C10': { value: 30, type: 'number' }, 'D10': { value: 90, type: 'number' }, 'E10': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'E2',
      expectedValue: 2,
      instruction: 'Conte os lotes aprovados (>=50) para os 9 grupos usando =CONT.SE(B2:D2; ">=50") até E10.',
      operationName: 'Função =CONT.SE()',
      acceptedFormulasDescription: '=CONT.SE(B2:D2; ">=50") até E10',
      allowedFunctions: ['CONT.SE', 'COUNTIF'],
      requiredCells: ['B2', 'D2'],
      hints: ['=CONT.SE(B2:D2; ">=50")', 'Conta quantos valores são >= 50.', 'Digite =CONT.SE(B2:D2; ">=50")'],
      questions: [
        { questionIndex: 1, targetCell: 'E2', expectedValue: 2, instruction: 'Q1/9: =CONT.SE(B2:D2; ">=50") em E2.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B2:D2; ">=50")', requiredCells: ['B2', 'D2'], hints: ['=CONT.SE(B2:D2; ">=50")', 'B2:D2', 'Digite =CONT.SE(B2:D2; ">=50")'] },
        { questionIndex: 2, targetCell: 'E3', expectedValue: 3, instruction: 'Q2/9: =CONT.SE(B3:D3; ">=50") em E3.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B3:D3; ">=50")', requiredCells: ['B3', 'D3'], hints: ['=CONT.SE(B3:D3; ">=50")', 'B3:D3', 'Digite =CONT.SE(B3:D3; ">=50")'] },
        { questionIndex: 3, targetCell: 'E4', expectedValue: 0, instruction: 'Q3/9: =CONT.SE(B4:D4; ">=50") em E4.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B4:D4; ">=50")', requiredCells: ['B4', 'D4'], hints: ['=CONT.SE(B4:D4; ">=50")', 'B4:D4', 'Digite =CONT.SE(B4:D4; ">=50")'] },
        { questionIndex: 4, targetCell: 'E5', expectedValue: 2, instruction: 'Q4/9: =CONT.SE(B5:D5; ">=50") em E5.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B5:D5; ">=50")', requiredCells: ['B5', 'D5'], hints: ['=CONT.SE(B5:D5; ">=50")', 'B5:D5', 'Digite =CONT.SE(B5:D5; ">=50")'] },
        { questionIndex: 5, targetCell: 'E6', expectedValue: 2, instruction: 'Q5/9: =CONT.SE(B6:D6; ">=50") em E6.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B6:D6; ">=50")', requiredCells: ['B6', 'D6'], hints: ['=CONT.SE(B6:D6; ">=50")', 'B6:D6', 'Digite =CONT.SE(B6:D6; ">=50")'] },
        { questionIndex: 6, targetCell: 'E7', expectedValue: 1, instruction: 'Q6/9: =CONT.SE(B7:D7; ">=50") em E7.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B7:D7; ">=50")', requiredCells: ['B7', 'D7'], hints: ['=CONT.SE(B7:D7; ">=50")', 'B7:D7', 'Digite =CONT.SE(B7:D7; ">=50")'] },
        { questionIndex: 7, targetCell: 'E8', expectedValue: 3, instruction: 'Q7/9: =CONT.SE(B8:D8; ">=50") em E8.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B8:D8; ">=50")', requiredCells: ['B8', 'D8'], hints: ['=CONT.SE(B8:D8; ">=50")', 'B8:D8', 'Digite =CONT.SE(B8:D8; ">=50")'] },
        { questionIndex: 8, targetCell: 'E9', expectedValue: 0, instruction: 'Q8/9: =CONT.SE(B9:D9; ">=50") em E9.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B9:D9; ">=50")', requiredCells: ['B9', 'D9'], hints: ['=CONT.SE(B9:D9; ">=50")', 'B9:D9', 'Digite =CONT.SE(B9:D9; ">=50")'] },
        { questionIndex: 9, targetCell: 'E10', expectedValue: 2, instruction: 'Q9/9: =CONT.SE(B10:D10; ">=50") em E10.', operationName: 'CONT.SE', acceptedFormulasDescription: '=CONT.SE(B10:D10; ">=50")', requiredCells: ['B10', 'D10'], hints: ['=CONT.SE(B10:D10; ">=50")', 'B10:D10', 'Digite =CONT.SE(B10:D10; ">=50")'] },
      ],
      realExcelInstructions: {
        sheetName: '9 - Almoxarifado Sensores',
        sheetIndex: 8,
        cellsToFill: 'E2 até E10',
        expectedResultText: '2, 3, 0, 2, 2, 1, 3, 0, 2',
        description: 'Na aba 9, preencha as 9 células da coluna E com a função CONT.SE.'
      }
    }
  },

  // FASE 10: 10 Questões (E2 a E11) - Cálculo Composto =(B+C)/D
  {
    id: 10,
    title: 'Fase 10 — O Supercomputador Central',
    subtitle: '10 Questões • Precedência & Cálculo Composto',
    theme: 'boss',
    accentColor: '#ec4899',
    bgGradient: 'from-slate-950 via-purple-950 to-slate-950',
    learningGoal: 'Dominar parênteses e fórmulas compostas no cálculo industrial avançado do SENAI',
    storyIntro: 'O Desafio Supremo do SENAIZINHO: Calcule a média de produtividade de 10 células fabris usando =(B+C)/D!',
    coinsAvailable: 5,
    worldMapCoordinates: { x: 880, y: 320 },
    grid: {
      columns: ['A', 'B', 'C', 'D', 'E'],
      rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      cells: {
        'A1': { value: 'Célula Fabril', type: 'label' }, 'B1': { value: 'Linha 1', type: 'label' }, 'C1': { value: 'Linha 2', type: 'label' }, 'D1': { value: 'Turnos', type: 'label' }, 'E1': { value: 'Média/Turno', type: 'label' },
        'A2': { value: 'Célula 01', type: 'label' }, 'B2': { value: 300, type: 'number' }, 'C2': { value: 200, type: 'number' }, 'D2': { value: 2, type: 'number' }, 'E2': { value: '?', type: 'editable' },
        'A3': { value: 'Célula 02', type: 'label' }, 'B3': { value: 150, type: 'number' }, 'C3': { value: 250, type: 'number' }, 'D3': { value: 2, type: 'number' }, 'E3': { value: '?', type: 'editable' },
        'A4': { value: 'Célula 03', type: 'label' }, 'B4': { value: 400, type: 'number' }, 'C4': { value: 200, type: 'number' }, 'D4': { value: 3, type: 'number' }, 'E4': { value: '?', type: 'editable' },
        'A5': { value: 'Célula 04', type: 'label' }, 'B5': { value: 500, type: 'number' }, 'C5': { value: 500, type: 'number' }, 'D5': { value: 4, type: 'number' }, 'E5': { value: '?', type: 'editable' },
        'A6': { value: 'Célula 05', type: 'label' }, 'B6': { value: 120, type: 'number' }, 'C6': { value: 180, type: 'number' }, 'D6': { value: 2, type: 'number' }, 'E6': { value: '?', type: 'editable' },
        'A7': { value: 'Célula 06', type: 'label' }, 'B7': { value: 600, type: 'number' }, 'C7': { value: 300, type: 'number' }, 'D7': { value: 3, type: 'number' }, 'E7': { value: '?', type: 'editable' },
        'A8': { value: 'Célula 07', type: 'label' }, 'B8': { value: 220, type: 'number' }, 'C8': { value: 180, type: 'number' }, 'D8': { value: 2, type: 'number' }, 'E8': { value: '?', type: 'editable' },
        'A9': { value: 'Célula 08', type: 'label' }, 'B9': { value: 350, type: 'number' }, 'C9': { value: 450, type: 'number' }, 'D9': { value: 4, type: 'number' }, 'E9': { value: '?', type: 'editable' },
        'A10': { value: 'Célula 09', type: 'label' }, 'B10': { value: 250, type: 'number' }, 'C10': { value: 250, type: 'number' }, 'D10': { value: 2, type: 'number' }, 'E10': { value: '?', type: 'editable' },
        'A11': { value: 'Célula 10', type: 'label' }, 'B11': { value: 400, type: 'number' }, 'C11': { value: 400, type: 'number' }, 'D11': { value: 2, type: 'number' }, 'E11': { value: '?', type: 'editable' },
      }
    },
    challenge: {
      targetCell: 'E2',
      expectedValue: 250,
      instruction: 'Resolva as 10 células de produtividade usando =(B+C)/D nas células E2 até E11.',
      operationName: 'Cálculo Composto / Precedência',
      acceptedFormulasDescription: '=(B2+C2)/D2 até =(B11+C11)/D11',
      allowedFunctions: ['SOMA', 'SUM'],
      requiredCells: ['B2', 'C2', 'D2'],
      hints: ['=(B2+C2)/D2', 'Os parênteses somam antes de dividir.', 'Digite =(B2+C2)/D2'],
      questions: [
        { questionIndex: 1, targetCell: 'E2', expectedValue: 250, instruction: 'Q1/10: =(B2+C2)/D2 em E2.', operationName: 'Composto', acceptedFormulasDescription: '=(B2+C2)/D2', requiredCells: ['B2', 'C2', 'D2'], hints: ['=(B2+C2)/D2', 'Linha 2', 'Digite =(B2+C2)/D2'] },
        { questionIndex: 2, targetCell: 'E3', expectedValue: 200, instruction: 'Q2/10: =(B3+C3)/D3 em E3.', operationName: 'Composto', acceptedFormulasDescription: '=(B3+C3)/D3', requiredCells: ['B3', 'C3', 'D3'], hints: ['=(B3+C3)/D3', 'Linha 3', 'Digite =(B3+C3)/D3'] },
        { questionIndex: 3, targetCell: 'E4', expectedValue: 200, instruction: 'Q3/10: =(B4+C4)/D4 em E4.', operationName: 'Composto', acceptedFormulasDescription: '=(B4+C4)/D4', requiredCells: ['B4', 'C4', 'D4'], hints: ['=(B4+C4)/D4', 'Linha 4', 'Digite =(B4+C4)/D4'] },
        { questionIndex: 4, targetCell: 'E5', expectedValue: 250, instruction: 'Q4/10: =(B5+C5)/D5 em E5.', operationName: 'Composto', acceptedFormulasDescription: '=(B5+C5)/D5', requiredCells: ['B5', 'C5', 'D5'], hints: ['=(B5+C5)/D5', 'Linha 5', 'Digite =(B5+C5)/D5'] },
        { questionIndex: 5, targetCell: 'E6', expectedValue: 150, instruction: 'Q5/10: =(B6+C6)/D6 em E6.', operationName: 'Composto', acceptedFormulasDescription: '=(B6+C6)/D6', requiredCells: ['B6', 'C6', 'D6'], hints: ['=(B6+C6)/D6', 'Linha 6', 'Digite =(B6+C6)/D6'] },
        { questionIndex: 6, targetCell: 'E7', expectedValue: 300, instruction: 'Q6/10: =(B7+C7)/D7 em E7.', operationName: 'Composto', acceptedFormulasDescription: '=(B7+C7)/D7', requiredCells: ['B7', 'C7', 'D7'], hints: ['=(B7+C7)/D7', 'Linha 7', 'Digite =(B7+C7)/D7'] },
        { questionIndex: 7, targetCell: 'E8', expectedValue: 200, instruction: 'Q7/10: =(B8+C8)/D8 em E8.', operationName: 'Composto', acceptedFormulasDescription: '=(B8+C8)/D8', requiredCells: ['B8', 'C8', 'D8'], hints: ['=(B8+C8)/D8', 'Linha 8', 'Digite =(B8+C8)/D8'] },
        { questionIndex: 8, targetCell: 'E9', expectedValue: 200, instruction: 'Q8/10: =(B9+C9)/D9 em E9.', operationName: 'Composto', acceptedFormulasDescription: '=(B9+C9)/D9', requiredCells: ['B9', 'C9', 'D9'], hints: ['=(B9+C9)/D9', 'Linha 9', 'Digite =(B9+C9)/D9'] },
        { questionIndex: 9, targetCell: 'E10', expectedValue: 250, instruction: 'Q9/10: =(B10+C10)/D10 em E10.', operationName: 'Composto', acceptedFormulasDescription: '=(B10+C10)/D10', requiredCells: ['B10', 'C10', 'D10'], hints: ['=(B10+C10)/D10', 'Linha 10', 'Digite =(B10+C10)/D10'] },
        { questionIndex: 10, targetCell: 'E11', expectedValue: 400, instruction: 'Q10/10: =(B11+C11)/D11 em E11.', operationName: 'Composto', acceptedFormulasDescription: '=(B11+C11)/D11', requiredCells: ['B11', 'C11', 'D11'], hints: ['=(B11+C11)/D11', 'Linha 11', 'Digite =(B11+C11)/D11'] },
      ],
      realExcelInstructions: {
        sheetName: '10 - Supercomputador Central',
        sheetIndex: 9,
        cellsToFill: 'E2 até E11',
        expectedResultText: '250, 200, 200, 250, 150, 300, 200, 200, 250, 400',
        description: 'Na aba 10, preencha as 10 células amarelas da coluna E com o cálculo =(B+C)/D.'
      }
    }
  }
];

export const GAME_MEDALS: Medal[] = [
  { id: 'first_steps', title: 'Primeiros Passos', description: 'Iniciou a jornada com o SENAIZINHO.', icon: '🪙' },
  { id: 'addition_master', title: 'Mestre da Adição', description: 'Concluiu a Fase 1 — Mercado das Somas.', icon: '➕' },
  { id: 'subtraction_pro', title: 'Especialista em Subtração', description: 'Resolveu as 2 questões da Fase 2.', icon: '➖' },
  { id: 'multiplication_champ', title: 'Multiplicador SENAI', description: 'Automatizou as 3 linhas da Fase 3.', icon: '✖️' },
  { id: 'average_guru', title: 'Guru das Médias', description: 'Calculou as 4 médias dos robôs na Fase 4.', icon: '📊' },
  { id: 'boss_slayer', title: 'Campeão dos Descontos', description: 'Decifrou os 5 descontos da Fase 5.', icon: '👑' },
  { id: 'logic_condition_master', title: 'Inspetor Lógico', description: 'Completou as 6 inspeções da Fase 6 com =SE().', icon: '⚡' },
  { id: 'max_finder', title: 'Engenheiro de Picos', description: 'Identificou os 7 picos da Usina na Fase 7 com =MÁXIMO().', icon: '📈' },
  { id: 'min_precision', title: 'Mestre da Precisão', description: 'Aferiu as 8 tolerâncias da Fase 8 com =MÍNIMO().', icon: '🔬' },
  { id: 'count_if_analyst', title: 'Analista de Dados', description: 'Processou as 9 contagens da Fase 9 com =CONT.SE().', icon: '🎯' },
  { id: 'master_supercomputer', title: 'Mestre Supremo SENAI 4.0', description: 'Zerou as 10 células do Supercomputador na Fase 10!', icon: '🏆' },
  { id: 'excel_practitioner', title: 'Praticante no Excel Real', description: 'Confirmou a prática no Excel do PC.', icon: '💻' },
  { id: 'senai_diploma', title: 'Diploma de Honra SENAI', description: 'Concluiu com louvor todas as 10 fases do jogo!', icon: '🎓' }
];
