import Matrix from './matrix.js';

(async () => {   
    const m1 = new Matrix([
        [1, 2],
        [5, 3],
    ]);
    
    const m2 = new Matrix([
        [1, 2],
        [5, 3]
    ]);

    console.log("\n--- Сортировка ---");
    
    m1.sort().print();
    (await m2.asyncSort((x, y) => y - x)).print();

    console.log("\n--- Сложение ---");
    m1.add(m2).print();
    (await m2.asyncAdd(m2)).print();

    console.log("\n--- Умножение ---");
    m1.multiply(m2).print();
    (await m2.asyncMultiply(m2)).print();
})();
