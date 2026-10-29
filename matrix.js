export default class Matrix {
    static ERRORS = {
        NO_DATA: "В конструктор матрицы ничего не передано или передан null",
        NOT_ARRAY: "Данные переданные в конструктор должны быть непустым массивом",
        ROW_NOT_ARRAY: (i) => `Строка с индексом ${i} не является массивом`,
        ROW_LENGTH: (i, j) => `Длинна строки ${i} не должна быть пустой и должна быть равна длинне первой строки ${j}`,
        CELL_NOT_NUMBER: (i, j, val) => `Элемент матрицы [${i}][${j}] не является числом [${val}]`,
        ARGUMENT_NOT_MATRIX: "В метод должен быть передан экземпляр класса Matrix",
        ADD_MATIRX_LENGTH: "Матрицы должны быть одинакового размера для сложения",
        MULTIPLY_MATRIX_LENGTH: (i ,j) => `Невозможно умножить матрицы: количество столбцов первой матрицы (${i}) должно совпадать с количеством строк второй матрицы (${j})`
    };
    
    constructor(matrixData) {
        //Проверим, что значение передано и оно не null
        if (matrixData == null) {
            throw new TypeError(Matrix.ERRORS.NO_DATA);
        }

        //Проверим, что передан массив и он не пустой
        if (!Array.isArray(matrixData) || matrixData.length === 0) {
            throw new TypeError(Matrix.ERRORS.NOT_ARRAY);
        }

        //Запомним длину первой строки, все остальные строки должны быть такой же длинны
        const firstRowLength = Array.isArray(matrixData[0]) ? matrixData[0].length : -1;

        //Пройдемся по всем строкам и проверим их валидность
        for (let i = 0; i < matrixData.length; i++) {
            const nextRow = matrixData[i]; 

            // Проверяем, что текущая строка является массивом
            if (!Array.isArray(nextRow)) {
                throw new TypeError(Matrix.ERRORS.ROW_NOT_ARRAY(i));
            }

            // Проверяем, совпадает ли длина текущей строки с длинной первой строки + строка не пустая,
            if (nextRow.length !== firstRowLength || nextRow.length === 0) {
                throw new Error(Matrix.ERRORS.ROW_LENGTH(i, firstRowLength));
            }

            // Пройдемся по столбцам и проверим что в ячейках числа
            for (let j = 0; j < nextRow.length; j++) {
                const nextCell = nextRow[j]; 

                if (typeof nextCell !== "number" || Number.isNaN(nextCell)) {
                    throw new TypeError(Matrix.ERRORS.CELL_NOT_NUMBER(i, j, nextCell));
                }
            }
        }

        //Скопируем данные чтобы никто не мог изменить их снаружи
        this.data = matrixData.map(row => [...row]);
    }

    print() {
        console.table(this.data);
    }

    sort(compareFunc = (x, y) => x - y) {
        // flat() выпрямлет двумерный массив в одномерный и далее делаем сортировку
        const flatDataArr = this.data.flat().sort(compareFunc);
        
        // вырезаем строки flatDataArr.splice равные длинне строки исходного двумерного массива
        const sortedData = this.data.map(row => flatDataArr.splice(0, row.length));
        
        return new Matrix(sortedData);
    }

    add(secondMatrix) {
        if (!(secondMatrix instanceof Matrix)) {
            throw new TypeError(Matrix.ERRORS.ARGUMENT_NOT_MATRIX);
        }

        if (this.data.length !== secondMatrix.data.length || this.data[0].length !== secondMatrix.data[0].length) {
            throw new Error(Matrix.ERRORS.ADD_MATIRX_LENGTH);
        }

        const flatSelfDataArr = this.data.flat();
        const flatSecondDataArr = secondMatrix.data.flat();

        const flatSumArr = flatSelfDataArr.map((val, idx) => val + flatSecondDataArr[idx]);

        const resultSumData = this.data.map(row => flatSumArr.splice(0, row.length));

        return new Matrix(resultSumData);
    }

    multiply(secondMatrix) {
        if (!(secondMatrix instanceof Matrix)) {
            throw new TypeError(Matrix.ERRORS.ARGUMENT_NOT_MATRIX);
        }

        const cols1 = this.data[0].length;
        const rows2 = secondMatrix.data.length;

        if (cols1 !== rows2) {
            throw new Error(Matrix.ERRORS.MULTIPLY_MATRIX_LENGTH(cols1, rows2));
        }

        // Переворачиваем вторую матрицу, чтобы ее столбцы стали строками
        const otherColsAsRows = secondMatrix.data[0].map((_, j) => 
            secondMatrix.data.map(row => row[j])
        );

        // новые строки через map и произведение в reduce
        const resultData = this.data.map(row1 => 
            otherColsAsRows.map(row2 => 
                row1.reduce((sum, val, idx) => sum + val * row2[idx], 0)
            )
        );

        return new Matrix(resultData);
    }

    async asyncSort(compareFunc = (x, y) => x - y) {
        await new Promise(resolve => setTimeout(resolve, 0)); // это хак для разгрузки основного потока
        return this.sort(compareFunc);
    }

    async asyncAdd(secondMatrix) {
        await new Promise(resolve => setTimeout(resolve, 0));
        return this.add(secondMatrix);
    }

    async asyncMultiply(secondMatrix) {
        await new Promise(resolve => setTimeout(resolve, 0));
        return this.multiply(secondMatrix);
    }
}

