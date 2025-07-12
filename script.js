let buildingChart;

function showTrig(type) {
    const infoDiv = document.getElementById('trig-info');
    const opposite = document.getElementById('side-opposite');
    const adjacent = document.getElementById('side-adjacent');
    const hypotenuse = document.getElementById('side-hypotenuse');

    document.querySelectorAll('.interactive-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    [opposite, adjacent, hypotenuse].forEach(side => {
        side.style.opacity = 0.2;
        side.style.fontWeight = 'normal';
    });

    let htmlContent = '';
    if (type === 'sin') {
        htmlContent = `<h3 class="font-bold text-lg">사인 (sin A)</h3><p class="mt-2 text-gray-700">sin A = 빗변 분의 높이</p><p class="mt-1 text-sm text-gray-500">각 A를 마주보는 '높이'와 가장 긴 '빗변'의 비율입니다.</p>`;
        opposite.style.opacity = 1;
        hypotenuse.style.opacity = 1;
        opposite.style.fontWeight = 'bold';
        hypotenuse.style.fontWeight = 'bold';
    } else if (type === 'cos') {
        htmlContent = `<h3 class="font-bold text-lg">코사인 (cos A)</h3><p class="mt-2 text-gray-700">cos A = 빗변 분의 밑변</p><p class="mt-1 text-sm text-gray-500">각 A의 옆에 있는 '밑변'과 가장 긴 '빗변'의 비율입니다.</p>`;
        adjacent.style.opacity = 1;
        hypotenuse.style.opacity = 1;
        adjacent.style.fontWeight = 'bold';
        hypotenuse.style.fontWeight = 'bold';
    } else if (type === 'tan') {
        htmlContent = `<h3 class="font-bold text-lg">탄젠트 (tan A)</h3><p class="mt-2 text-gray-700">tan A = 밑변 분의 높이</p><p class="mt-1 text-sm text-gray-500">각 A의 '밑변'에 대한 '높이'의 비율입니다. 기울기와 관련이 깊죠!</p>`;
        opposite.style.opacity = 1;
        adjacent.style.opacity = 1;
        opposite.style.fontWeight = 'bold';
        adjacent.style.fontWeight = 'bold';
    }
    infoDiv.innerHTML = htmlContent;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function calculateMyHeight() {
    const shadowLength = parseFloat(document.getElementById('shadow-length').value);
    const sunAngle = parseFloat(document.getElementById('sun-angle').value);
    const resultDiv = document.getElementById('height-result');

    if (isNaN(shadowLength) || isNaN(sunAngle) || sunAngle <= 0 || sunAngle >= 90) {
        resultDiv.innerHTML = '유효한 그림자 길이와 각도(1~89도)를 입력해주세요.';
        resultDiv.classList.remove('hidden');
        resultDiv.classList.replace('bg-green-50', 'bg-red-50');
        resultDiv.classList.replace('text-green-800', 'text-red-800');
        return;
    }

    const myHeight = shadowLength * Math.tan(degreesToRadians(sunAngle));
    resultDiv.innerHTML = `계산된 당신의 키는 약 ${myHeight.toFixed(1)} cm 입니다!`;
    resultDiv.classList.remove('hidden');
    resultDiv.classList.replace('bg-red-50', 'bg-green-50');
    resultDiv.classList.replace('text-red-800', 'text-green-800');
}

function calculateBuildingHeight() {
    const distance = parseFloat(document.getElementById('building-distance').value);
    const angle = parseFloat(document.getElementById('elevation-angle').value);
    const eyeHeight = parseFloat(document.getElementById('eye-height').value);
    const resultDiv = document.getElementById('building-result');

    if (isNaN(distance) || isNaN(angle) || isNaN(eyeHeight) || angle <= 0 || angle >= 90) {
        resultDiv.innerHTML = '유효한 거리, 각도(1~89도), 눈높이를 입력해주세요.';
        resultDiv.classList.remove('hidden');
        resultDiv.classList.replace('bg-blue-50', 'bg-red-50');
        resultDiv.classList.replace('text-blue-800', 'text-red-800');
        if(buildingChart) buildingChart.destroy();
        return;
    }

    const calculatedHeight = distance * Math.tan(degreesToRadians(angle));
    const totalHeight = calculatedHeight + eyeHeight;

    resultDiv.innerHTML = `계산된 건물의 총 높이는 약 ${totalHeight.toFixed(2)} m 입니다!`;
    resultDiv.classList.remove('hidden');
    resultDiv.classList.replace('bg-red-50', 'bg-blue-50');
    resultDiv.classList.replace('text-red-800', 'text-blue-800');

    updateBuildingChart(calculatedHeight, eyeHeight);
}

function updateBuildingChart(calculatedHeight, eyeHeight) {
    const ctx = document.getElementById('buildingHeightChart').getContext('2d');
    const data = {
        labels: ['건물 높이'],
        datasets: [
            {
                label: '눈높이부터 꼭대기까지 높이',
                data: [calculatedHeight.toFixed(2)],
                backgroundColor: '#A2B9D1',
            },
            {
                label: '측정자 눈높이',
                data: [eyeHeight.toFixed(2)],
                backgroundColor: '#8A9A5B',
            }
        ]
    };

    if (buildingChart) {
        buildingChart.destroy();
    }

    buildingChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '건물 높이 구성 (단위: m)',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + 'm';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '높이 (m)'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    calculateBuildingHeight();
});