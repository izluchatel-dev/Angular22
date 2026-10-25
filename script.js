const array0 = [3, 2, 1];
const array1 = [3, 4, 2, 5];

function intersect(firstArray, secondArray){
    if (firstArray == null || secondArray == null) {
        throw new ReferenceError("Функция ожидает два обязательных аргумента");
    }
    
    if (!Array.isArray(firstArray) || !Array.isArray(secondArray)) {
        throw new TypeError("Переданные аргументы должны быть массивами");
    }

    if (firstArray.length === 0 || secondArray.length === 0) {
        return [];
    }

    if (firstArray === secondArray) {
        return Array.from(new Set(firstArray));
    }

    const firstSet = new Set(firstArray);

    const resultSet = new Set();

    for (const item of secondArray) {
        if (firstSet.has(item)) {
            resultSet.add(item);
        }
    }

    return Array.from(resultSet);
}

console.log(intersect(array0, array1));