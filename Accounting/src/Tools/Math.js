
const units = ['Unit', 'Kgram', 'Gram', 'Piece'];

// Conversion rates (base unit is 1 kilogram)
const conversionRates = {
    'kgram': 1,       // 1 Kilogram
    'gram': 0.001,    // 1 Gram is 0.001 Kilograms
    'piece': 1,       // 1 Piece (assuming it's the same as 1 Unit for simplicity)
    'unit': "Error"         // 1 Unit (assuming it's the same as 1 Piece for simplicity)
};

function calculateTotalPrice(quantity, unit, pricePerUnit) {
    let conversionRate = conversionRates[unit]
    let quantityInKg = quantity * conversionRate
    let totalPrice = quantityInKg * pricePerUnit
    return totalPrice;
}




export{
    units,
    calculateTotalPrice,

}
