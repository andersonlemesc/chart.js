const express = require('express');
const { createCanvas } = require('canvas');
const Chart = require('chart.js');

const app = express();
const port = 3000;

// Função para gerar gráficos em tamanho A4 (com proporção correta)
function getCanvasDimensions(size = 'A4') {
  // Tamanhos em milímetros para A4 (210mm x 297mm)
  const A4WidthMM = 210;
  const A4HeightMM = 297;

  // Definindo uma resolução de 300 DPI (dots per inch) para alta qualidade
  const DPI = 300;
  const width = (A4WidthMM / 25.4) * DPI; // Convertendo mm para polegadas e aplicando DPI

  // Calculando altura proporcional com base na largura (por exemplo, aspecto de 4:3)
  const aspectRatio = 4 / 3; // Aspect ratio do gráfico, pode ser ajustado conforme necessário
  const height = width / aspectRatio;

  return { width, height };
}

// API para gerar o gráfico com tipo dinâmico
app.get('/chart', (req, res) => {
  // Recebe os parâmetros da URL
  const labels = req.query.labels ? req.query.labels.split(',') : ['Red', 'Blue', 'Yellow', 'Green'];
  const data = req.query.data ? req.query.data.split(',').map(Number) : [300, 50, 100, 80];
  const chartType = req.query.type || 'bar'; // Tipo de gráfico: 'bar', 'line', 'pie', 'radar'

  // Verifica se o tipo de gráfico é válido
  const validTypes = ['bar', 'line', 'pie', 'radar'];
  if (!validTypes.includes(chartType)) {
    return res.status(400).send('Tipo de gráfico inválido. Use "bar", "line", "pie" ou "radar".');
  }

  // Obtendo as dimensões de A4 com alta resolução (300 DPI) e ajustando a altura
  const { width, height } = getCanvasDimensions('A4');

  // Configuração do gráfico com o canvas de alta resolução
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Defina o fundo transparente do canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Garantir que o fundo seja transparente

  const chart = new Chart(ctx, {
    type: chartType, // Usa o tipo de gráfico passado na URL
    data: {
      labels: labels,
      datasets: [{
        label: 'My Dataset',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', 
          'rgba(54, 162, 235, 0.2)', 
          'rgba(255, 206, 86, 0.2)', 
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 
          'rgba(54, 162, 235, 1)', 
          'rgba(255, 206, 86, 1)', 
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: false, // Desabilitar a responsividade, pois o gráfico será gerado em uma resolução específica
      scales: {
        x: {
          ticks: {
            font: {
              size: 38, // Tamanho da fonte das labels do eixo X
              family: 'Arial', // Família da fonte
              weight: 'bold' // Peso da fonte (negrito, por exemplo)
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 38, // Tamanho da fonte das labels do eixo Y
              family: 'Arial',
              weight: 'bold'
            },
            beginAtZero: true
          }
        }
      },
      plugins: {
        legend: {
          display: false, // Desativar a exibição da legenda
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw;
            }
          }
        }
      },
      // Remover o fundo do gráfico (geral)
      elements: {
        point: {
          radius: 0 // Remover pontos do gráfico de linha
        }
      },
      // Definir fundo transparente
      layout: {
        padding: 0 // Remove o espaço em volta do gráfico
      },
      // Opções para cada tipo de gráfico para garantir que o fundo seja transparente
      responsiveAnimationDuration: 0,
      // Se o tipo for "pie" ou "doughnut", os dados de fundo são transparentes
      cutoutPercentage: chartType === 'pie' || chartType === 'doughnut' ? 50 : 0, // Para pizza, cria um corte central
      backgroundColor: 'rgba(0, 0, 0, 0)', // Definindo o fundo geral para transparente
    }
  });

  // Enviar o gráfico como imagem PNG com fundo transparente
  res.setHeader('Content-Type', 'image/png');
  canvas.pngStream().pipe(res);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

