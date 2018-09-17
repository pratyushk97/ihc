export default class MedicationInventory {}

MedicationInventory.schema = {
  name: 'MedicationInventory',
  properties: {
    inStock: 'Medication[]',
    outOfStock: 'Medication[]'
  }
};
