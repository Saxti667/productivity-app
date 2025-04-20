/**
 * Gestion des catégories
 * Ce module gère les catégories d'activités et leur interaction avec l'interface
 */

// Éléments DOM
let categoryNameInput;
let categoryColorInput;
let addCategoryBtn;
let categoriesList;
let taskCategorySelect;

// Catégorie actuellement sélectionnée
let selectedCategoryId = null;

/**
 * Initialise la gestion des catégories
 */
function initCategories() {
    // Récupération des éléments DOM
    categoryNameInput = document.getElementById('category-name');
    categoryColorInput = document.getElementById('category-color');
    addCategoryBtn = document.getElementById('add-category-btn');
    categoriesList = document.getElementById('categories-list');
    taskCategorySelect = document.getElementById('task-category');
    
    if (!categoryNameInput || !categoryColorInput || !addCategoryBtn || !categoriesList) {
        console.error('Éléments DOM manquants pour les catégories');
        return;
    }
    
    // Événement d'ajout de catégorie
    addCategoryBtn.addEventListener('click', handleAddCategory);
    
    // Chargement des catégories existantes
    loadCategories();
}

/**
 * Gère l'ajout d'une nouvelle catégorie
 */
function handleAddCategory() {
    const name = categoryNameInput.value.trim();
    const color = categoryColorInput.value;
    
    if (!name) {
        showErrorMessage('Veuillez saisir un nom de catégorie');
        return;
    }
    
    // Création de la catégorie
    createCategory(name, color);
    
    // Réinitialisation du formulaire
    categoryNameInput.value = '';
    categoryColorInput.value = '#4287f5';
}

/**
 * Crée une nouvelle catégorie
 * @param {string} name - Nom de la catégorie
 * @param {string} color - Couleur de la catégorie (code hexadécimal)
 * @returns {Object} La catégorie créée
 */
function createCategory(name, color) {
    const id = 'cat_' + Date.now();
    const category = { id, name, color };
    
    // Récupération des catégories existantes
    const categories = getCategories();
    
    // Vérification des doublons
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        showErrorMessage('Une catégorie avec ce nom existe déjà');
        return null;
    }
    
    // Ajout de la nouvelle catégorie
    categories.push(category);
    
    // Sauvegarde
    saveCategories(categories);
    
    // Mise à jour de l'affichage
    renderCategory(category);
    updateCategorySelect();
    
    return category;
}

/**
 * Charge les catégories depuis le stockage et les affiche
 */
function loadCategories() {
    const categories = getCategories();
    
    // Vider la liste actuelle
    categoriesList.innerHTML = '';
    
    // Afficher chaque catégorie
    categories.forEach(category => {
        renderCategory(category);
    });
    
    // Mettre à jour le select
    updateCategorySelect();
}

/**
 * Affiche une catégorie dans la liste
 * @param {Object} category - Catégorie à afficher
 */
function renderCategory(category) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    categoryElement.dataset.id = category.id;
    
    // Si cette catégorie est sélectionnée, ajouter la classe
    if (category.id === selectedCategoryId) {
        categoryElement.classList.add('selected');
    }
    
    const colorSpan = document.createElement('span');
    colorSpan.style.backgroundColor = category.color;
    
    categoryElement.appendChild(colorSpan);
    categoryElement.appendChild(document.createTextNode(category.name));
    
    // Événement de sélection de catégorie
    categoryElement.addEventListener('click', () => {
        selectCategory(category.id);
    });
    
    categoriesList.appendChild(categoryElement);
}

/**
 * Met à jour le select des catégories
 */
function updateCategorySelect() {
    if (!taskCategorySelect) return;
    
    const categories = getCategories();
    
    // Sauvegarde de la valeur sélectionnée
    const selectedValue = taskCategorySelect.value;
    
    // Vider les options actuelles sauf la première
    taskCategorySelect.innerHTML = '<option value="">-- Sélectionner une catégorie --</option>';
    
    // Ajouter chaque catégorie
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        taskCategorySelect.appendChild(option);
    });
    
    // Restaurer la valeur sélectionnée si elle existe toujours
    if (selectedValue && categories.some(cat => cat.id === selectedValue)) {
        taskCategorySelect.value = selectedValue;
    }
}

/**
 * Sélectionne une catégorie
 * @param {string} categoryId - ID de la catégorie à sélectionner
 */
function selectCategory(categoryId) {
    // Mettre à jour l'ID sélectionné
    selectedCategoryId = categoryId;
    
    // Mettre à jour la liste des catégories
    const categoryItems = categoriesList.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        if (item.dataset.id === categoryId) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Mettre à jour le select
    if (taskCategorySelect) {
        taskCategorySelect.value = categoryId;
    }
}

// Export des fonctions pour les autres modules
window.initCategories = initCategories;
window.createCategory = createCategory;
window.selectCategory = selectCategory;
window.getSelectedCategoryId = () => selectedCategoryId;