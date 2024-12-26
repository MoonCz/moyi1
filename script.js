let operationHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    const braceletCircle = document.getElementById('braceletCircle');
    const sizeInput = document.getElementById('bracelet-size');
    const sizeSlider = document.getElementById('bracelet-size-slider');
    const beadSizeInput = document.getElementById('bead-size');
    const beadSizeSlider = document.getElementById('bead-size-slider');

    // 更新珠子大小的函数
    function updateBeadSize(size) {
        // 将毫米转换为像素（使用更大的比例）
        const pixelSize = size * 4;  // 改为4:1的比例
        document.documentElement.style.setProperty('--bead-size', `${pixelSize}px`);
    }

    // 添加一个统一的位置计算函数
    function calculateBeadPositions() {
        const braceletSize = parseInt(sizeInput.value);
        const beadSize = parseInt(beadSizeInput.value);
        const numBeads = Math.floor(braceletSize / beadSize);
        
        const actualCircumference = numBeads * beadSize;
        const actualDiameter = actualCircumference / Math.PI;
        const pixelDiameter = actualDiameter * 6;
        const radius = pixelDiameter / 2;
        const beadPixelSize = beadSize * 6;

        return {
            numBeads,
            radius,
            beadPixelSize,
            pixelDiameter
        };
    }

    // 创建示例珠子
    function createExampleBeads() {
        const braceletCircle = document.getElementById('braceletCircle');
        const existingBeads = braceletCircle.querySelectorAll('.example-bead');
        existingBeads.forEach(bead => bead.remove());

        const { numBeads, radius, beadPixelSize, pixelDiameter } = calculateBeadPositions();
        
        // 更新圆圈大小
        braceletCircle.style.width = `${pixelDiameter}px`;
        braceletCircle.style.height = `${pixelDiameter}px`;

        for (let i = 0; i < numBeads; i++) {
            const bead = document.createElement('div');
            bead.className = 'example-bead';
            
            const angle = (i / numBeads) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            bead.style.left = `${radius + x}px`;
            bead.style.top = `${radius + y}px`;
            bead.style.width = `${beadPixelSize}px`;
            bead.style.height = `${beadPixelSize}px`;
            
            braceletCircle.appendChild(bead);

            setTimeout(() => {
                bead.classList.add('active');
            }, i * (400 / numBeads));
        }
    }

    // 更新圆圈大小的函数
    function updateCircleSize(size) {
        // 移除所有现有珠子的active类
        const existingBeads = braceletCircle.querySelectorAll('.example-bead');
        existingBeads.forEach(bead => bead.classList.remove('active'));

        // 短暂延迟后重新创建珠子和吸附点
        setTimeout(() => {
            createExampleBeads();
            createSnapPoints(); // 确保吸附点与新的珠子位置对应
        }, 50);
    }

    // 监听手串尺寸输入框变化
    sizeInput.addEventListener('input', function() {
        let size = Math.round(this.value / 10) * 10;
        size = Math.min(Math.max(size, 120), 240);
        sizeSlider.value = size;
        this.value = size;
        updateCircleSize(size);
    });

    // 监听手串尺寸滑块变化
    sizeSlider.addEventListener('input', function() {
        sizeInput.value = this.value;
        updateCircleSize(this.value);
    });

    // 监听珠子尺寸输入框变化
    beadSizeInput.addEventListener('input', function() {
        let size = Math.round(this.value);
        size = Math.min(Math.max(size, 2), 20);
        beadSizeSlider.value = size;
        this.value = size;
        createExampleBeads();
        createSnapPoints(); // 重新创建吸附点以匹配新的珠子尺寸
    });

    // 监听珠子尺寸滑块变化
    beadSizeSlider.addEventListener('input', function() {
        beadSizeInput.value = this.value;
        createExampleBeads();
        createSnapPoints(); // 重新创建吸附点以匹配新的珠子尺寸
    });

    // 珠子数据
    const beadsData = {
        white: [
            { id: 'w1', color: '#ffffff', name: '白玉珠', description: '优质白玉珠' },
            { id: 'w2', color: '#f5f5f5', name: '珍珠珠', description: '天然珍珠珠' },
            // 添加更多白色系列珠子...
        ],
        black: [
            { id: 'b1', color: '#000000', name: '黑玛瑙', description: '天然黑玛瑙' },
            { id: 'b2', color: '#333333', name: '黑曜石', description: '天然黑曜石' },
            // 添加更多黑色系列珠子...
        ],
        yellow: [
            { id: 'y1', color: '#ffd700', name: '黄水晶', description: '天然黄水晶' },
            { id: 'y2', color: '#ffa500', name: '琥珀珠', description: '天然琥珀珠' },
            // 添加更多黄色系列珠子...
        ],
        red: [
            { id: 'r1', color: '#ff0000', name: '红玛瑙', description: '天然红玛瑙' },
            { id: 'r2', color: '#dc143c', name: '红珊瑚', description: '天然红珊瑚' },
            // 添加更多红色系列珠子...
        ],
        green: [
            { id: 'g1', color: '#008000', name: '绿松石', description: '天然绿松石' },
            { id: 'g2', color: '#228b22', name: '翡翠珠', description: '天然翡翠珠' },
            // 添加更多绿色系列珠子...
        ]
    };

    // 初始化珠子展示
    function initializeBeads() {
        Object.entries(beadsData).forEach(([color, beads]) => {
            const container = document.querySelector(`.${color}-beads .beads-container`);
            beads.forEach(bead => {
                const beadElement = createBeadElement(bead, color);
                container.appendChild(beadElement);
            });
        });
    }

    // 创建珠子元素
    function createBeadElement(bead, colorClass) {
        const beadElement = document.createElement('div');
        beadElement.className = `bead-item ${colorClass}-bead`;
        beadElement.setAttribute('draggable', 'true');
        beadElement.dataset.beadId = bead.id;
        beadElement.dataset.beadColor = colorClass;

        // 添加拖拽事件监听器
        beadElement.addEventListener('dragstart', handleDragStart);
        beadElement.addEventListener('dragend', handleDragEnd);

        return beadElement;
    }

    // 拖拽事件处理
    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.beadId);
        
        // 添加拖动时的mousemove监听
        document.addEventListener('mousemove', handleDragMove);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
        // 移除所有高亮
        document.querySelectorAll('.snap-point').forEach(point => {
            point.classList.remove('highlight');
        });
        // 移除mousemove监听
        document.removeEventListener('mousemove', handleDragMove);
    }

    // 处理拖动时的移动
    function handleDragMove(e) {
        const snapPoints = document.querySelectorAll('.snap-point');
        let closestPoint = null;
        let minDistance = Infinity;

        // 计算到每个吸附点的距离
        snapPoints.forEach(point => {
            const rect = point.getBoundingClientRect();
            const pointX = rect.left + rect.width / 2;
            const pointY = rect.top + rect.height / 2;
            const distance = Math.hypot(e.clientX - pointX, e.clientY - pointY);

            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        });

        // 只高亮最近的吸附点，且必须在一定距离内
        snapPoints.forEach(point => {
            point.classList.remove('highlight');
        });
        
        if (minDistance < 50) { // 50px的触发距离
            closestPoint.classList.add('highlight');
        }
    }

    // 修改 createSnapPoints 函数
    function createSnapPoints() {
        const braceletCircle = document.getElementById('braceletCircle');
        const { numBeads, radius, beadPixelSize, pixelDiameter } = calculateBeadPositions();

        // 清除现有吸附点
        const existingPoints = braceletCircle.querySelectorAll('.snap-point');
        existingPoints.forEach(point => point.remove());

        for (let i = 0; i < numBeads; i++) {
            const angle = (i / numBeads) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            const snapPoint = document.createElement('div');
            snapPoint.className = 'snap-point';
            snapPoint.style.left = `${radius + x}px`;
            snapPoint.style.top = `${radius + y}px`;
            snapPoint.style.width = `${beadPixelSize}px`;
            snapPoint.style.height = `${beadPixelSize}px`;
            
            snapPoint.addEventListener('dragover', handleDragOver);
            snapPoint.addEventListener('drop', handleDrop);
            
            braceletCircle.appendChild(snapPoint);
        }
    }

    // 拖拽相关事件处理
    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('active');
    }

    function handleDrop(e) {
        e.preventDefault();
        const beadId = e.dataTransfer.getData('text/plain');
        const draggedBead = document.querySelector(`[data-bead-id="${beadId}"]`);
        const snapPoint = e.currentTarget;
        
        if (draggedBead) {
            const { beadPixelSize } = calculateBeadPositions();
            
            const newBead = draggedBead.cloneNode(true);
            // 置样式
            newBead.style = '';
            // 只添加基础类，不添加example-bead类
            newBead.className = 'bead-item';
            // 保持原来的颜色类
            newBead.classList.add(`${draggedBead.dataset.beadColor}-bead`);
            
            // 设置基本样式
            newBead.style.position = 'absolute';
            newBead.style.width = `${beadPixelSize}px`;
            newBead.style.height = `${beadPixelSize}px`;
            newBead.style.margin = '0';  // 移除margin
            
            // 使用与示例珠子相同的位置
            newBead.style.left = snapPoint.style.left;
            newBead.style.top = snapPoint.style.top;
            newBead.style.transform = 'translate(-50%, -50%)';
            
            // 添加移除功能
            addBeadRemoveListener(newBead);
            
            braceletCircle.appendChild(newBead);
            
            // 记录添加操作
            operationHistory.push({
                type: 'add',
                bead: newBead,
                position: {
                    left: newBead.style.left,
                    top: newBead.style.top
                }
            });
        }
        
        snapPoint.classList.remove('active');
    }

    // 修改移除珠子的事件监听器
    function addBeadRemoveListener(bead) {
        bead.addEventListener('dblclick', function() {
            // 记录移除操作
            operationHistory.push({
                type: 'remove',
                bead: bead.cloneNode(true),
                position: {
                    left: bead.style.left,
                    top: bead.style.top
                }
            });
            bead.remove();
        });
    }

    // 添加撤回功能
    function undoLastOperation() {
        if (operationHistory.length === 0) return;
        
        const lastOperation = operationHistory.pop();
        
        if (lastOperation.type === 'add') {
            // 如果上一步是添加珠子，则移除该珠子
            const beadToRemove = document.querySelector(
                `.example-bead[style*="left: ${lastOperation.position.left}"][style*="top: ${lastOperation.position.top}"]`
            );
            if (beadToRemove) {
                beadToRemove.style.transition = 'all 0.3s ease-out';
                beadToRemove.style.opacity = '0';
                beadToRemove.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => beadToRemove.remove(), 300);
            }
        } else if (lastOperation.type === 'remove') {
            // 如果上一步是移除珠子，则重新添该珠子
            const beadToAdd = lastOperation.bead;
            beadToAdd.style.opacity = '0';
            beadToAdd.style.transform = 'translate(-50%, -50%) scale(0)';
            braceletCircle.appendChild(beadToAdd);
            
            // 添加移除事件监听器
            addBeadRemoveListener(beadToAdd);
            
            // 添加动画效果
            setTimeout(() => {
                beadToAdd.style.opacity = '1';
                beadToAdd.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50);
        }
    }

    // 添加键盘快捷
    document.addEventListener('keydown', function(e) {
        // Ctrl+Z (Windows) 或 Command+Z (Mac)
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undoLastOperation();
        }
    });

    // 在现有的初始化代码中添加
    function initialize() {
        updateCircleSize(120);
        createExampleBeads();
        initializeBeads();
        createSnapPoints();
        createRulerRing();
    }

    // 在 DOMContentLoaded 事最调用初始化
    initialize();

    // 在 DOMContentLoaded 事件监听器中添加
    const resetButton = document.getElementById('resetDesign');

    // 添加重置按钮的点击事件处理
    resetButton.addEventListener('click', function() {
        // 获取所有已放置的珠子（不包括示例珠子）
        const placedBeads = braceletCircle.querySelectorAll('.bead-item');
        
        // 添加消失动画
        placedBeads.forEach(bead => {
            bead.style.transition = 'all 0.3s ease-out';
            bead.style.opacity = '0';
            bead.style.transform = 'translate(-50%, -50%) scale(0)';
        });

        // 等待动画完成后移除珠子
        setTimeout(() => {
            placedBeads.forEach(bead => bead.remove());
        }, 300);
    });

    let isRotating = false;
    let startAngle = 0;
    let currentRotation = 0;

    // 计算角度的函数
    function calculateAngle(e, center) {
        const x = e.clientX - center.x;
        const y = e.clientY - center.y;
        return Math.atan2(y, x) * 180 / Math.PI;
    }

    // 修改旋转控制代码
    const rotationRing = document.querySelector('.rotation-ring');
    rotationRing.addEventListener('mousedown', function(e) {
        isRotating = true;
        rotationRing.style.cursor = 'grabbing';
        
        // 获取圆心坐标
        const rect = braceletCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 记录起始角度
        startAngle = calculateAngle(e, { x: centerX, y: centerY }) - currentRotation;
        
        // 添加鼠标移动事件
        document.addEventListener('mousemove', handleRotation);
        document.addEventListener('mouseup', stopRotation);
    });

    function handleRotation(e) {
        if (!isRotating) return;
        
        // 获取圆坐标
        const rect = braceletCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 计算新的旋转角度
        const angle = calculateAngle(e, { x: centerX, y: centerY });
        currentRotation = angle - startAngle;
        
        // 应用旋转
        braceletCircle.style.transform = `rotate(${currentRotation}deg)`;
    }

    function stopRotation() {
        if (!isRotating) return;
        isRotating = false;
        rotationRing.style.cursor = 'grab';
        document.removeEventListener('mousemove', handleRotation);
        document.removeEventListener('mouseup', stopRotation);
    }
}); 

function updateBraceletSize(size) {
    const braceletCircle = document.getElementById('braceletCircle');
    const baseSize = 240; // 基础尺寸
    const scale = size / baseSize;
    
    braceletCircle.style.transform = `scale(${scale})`;
} 

// 添加创建刻度圆环的函数
function createRulerRing() {
    const svg = document.querySelector('.ruler-ring');
    const circumference = 600;
    const majorInterval = 10;
    const minorInterval = 2;
    const radius = 360;
    const controlWidth = 18;

    svg.setAttribute('viewBox', '0 0 800 800');
    const center = 400;

    // 清除现有刻度
    const existingMarks = svg.querySelectorAll('.ruler-mark');
    existingMarks.forEach(mark => mark.remove());

    // 添加旋转功能
    const braceletCircle = document.getElementById('braceletCircle');
    let isRotating = false;
    let startAngle = 0;
    let currentRotation = 0;

    // 添加鼠标移动监听
    svg.addEventListener('mousemove', handleMouseMove);

    svg.addEventListener('mousedown', function(e) {
        // 计算鼠标到圆心的距离
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left - center * (rect.width / 800);
        const y = e.clientY - rect.top - center * (rect.height / 800);
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const svgScale = rect.width / 800;
        const scaledRadius = radius * svgScale;
        const scaledControlWidth = controlWidth * svgScale;

        // 只有在控制区域内才允许旋转
        if (Math.abs(distanceFromCenter - scaledRadius) <= scaledControlWidth) {
            isRotating = true;
            svg.style.cursor = 'grabbing';
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 计算初始角度
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            startAngle = Math.atan2(mouseY, mouseX) * 180 / Math.PI;
            
            // 获取当前的旋转角度
            const transform = window.getComputedStyle(braceletCircle).getPropertyValue('transform');
            const matrix = new DOMMatrix(transform);
            currentRotation = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
            
            document.addEventListener('mousemove', handleRotation);
            document.addEventListener('mouseup', stopRotation);
        }
    });

    function handleRotation(e) {
        if (!isRotating) return;
        
        const rect = braceletCircle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = e.clientX - centerX;
        const y = e.clientY - centerY;
        const angle = Math.atan2(y, x) * 180 / Math.PI;
        
        const rotation = angle - startAngle + currentRotation;
        braceletCircle.style.transform = `rotate(${rotation}deg)`;

        // 在旋转时也触发刻度放大效果
        handleMouseMove(e);
    }

    function stopRotation() {
        if (!isRotating) return;
        isRotating = false;
        svg.style.cursor = 'grab';
        document.removeEventListener('mousemove', handleRotation);
        document.removeEventListener('mouseup', stopRotation);
    }

    // 计算总刻度数
    const totalMarks = circumference / minorInterval;
    const anglePerMark = 360 / totalMarks;

    for (let i = 0; i < totalMarks; i++) {
        const angle = i * anglePerMark;
        const radian = (angle - 90) * Math.PI / 180;
        
        // 计算刻度线的起点和终点
        const isMajor = i % (majorInterval / minorInterval) === 0;
        const markLength = isMajor ? 15 : 8;
        
        const x1 = center + (radius - markLength) * Math.cos(radian);
        const y1 = center + (radius - markLength) * Math.sin(radian);
        const x2 = center + radius * Math.cos(radian);
        const y2 = center + radius * Math.sin(radian);

        // 创建刻度线
        const mark = document.createElementNS("http://www.w3.org/2000/svg", "line");
        mark.setAttribute('x1', x1);
        mark.setAttribute('y1', y1);
        mark.setAttribute('x2', x2);
        mark.setAttribute('y2', y2);
        mark.setAttribute('class', `ruler-mark ${isMajor ? 'major' : ''}`);
        mark.dataset.angle = angle; // 存储角度信息
        svg.appendChild(mark);
    }

    // 处理鼠标移动事件
    function handleMouseMove(e) {
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left - center * (rect.width / 800);
        const y = e.clientY - rect.top - center * (rect.height / 800);
        const distanceFromCenter = Math.sqrt(x * x + y * y);
        const svgScale = rect.width / 800;
        const scaledRadius = radius * svgScale;
        const scaledControlWidth = controlWidth * svgScale;

        // 只在控制区域附近显示放大效果
        if (Math.abs(distanceFromCenter - scaledRadius) <= scaledControlWidth * 2) {
            // 计算鼠标位置相对于圆心的角度
            const mouseAngle = (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360;
            
            // 清除所有放大效果
            svg.querySelectorAll('.ruler-mark').forEach(mark => {
                mark.classList.remove('scale');
            });
            
            // 为附近的刻度添加放大效果
            svg.querySelectorAll('.ruler-mark').forEach(mark => {
                const markAngle = parseFloat(mark.dataset.angle);
                const angleDiff = Math.abs(mouseAngle - markAngle);
                if (angleDiff < 5 || Math.abs(angleDiff - 360) < 5) {
                    mark.classList.add('scale');
                }
            });
        } else {
            // 在控制区域外清除所有放大效果
            svg.querySelectorAll('.ruler-mark').forEach(mark => {
                mark.classList.remove('scale');
            });
        }
    }
} 