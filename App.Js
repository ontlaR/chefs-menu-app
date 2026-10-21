// Part 3 - Chef Menu App - Enhanced with manage; Search, Filter
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// REUSABLE COMPONENT - Requirement 4: Reusable components
// Used for every menu item card, so we don't repeat code
function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.dishName}</Text>
        <Text style={styles.cardPrice}>R {item.price}</Text>
      </View>
      <Text style={styles.cardCourse}>{item.course}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={[styles.smallButton, styles.editButton]} onPress={() => onEdit(item)}>
          <Text style={styles.smallButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallButton, styles.deleteButton]} onPress={() => onDelete(item)}>
          <Text style={styles.smallButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  // Form state - From Part 2
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Main Course');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  // PART 3 - Requirement 1: Manage Menu Items
  const [editingId, setEditingId] = useState(null); // null = adding, id = editing

  // PART 3 - Requirement 2: Search and Filter
  const [searchText, setSearchText] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');

  // REUSABLE FUNCTION - Requirement 4: Reduce repeated code
  const clearForm = () => {
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse('Main Course');
    setErrors({});
    setEditingId(null);
  };

  const validate = () => {
    let newErrors = {};
    if (!dishName.trim()) newErrors.dishName = "Dish name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(price) || Number(price) <= 0) newErrors.price = "Enter a valid price";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PART 2 + PART 3: Add OR Update in one function
  const handleSaveItem = () => {
    if (!validate()) return;

    if (editingId) {
      // --- UPDATE EXISTING ITEM ---
      const updatedItems = menuItems.map((item) =>
        item.id === editingId
          ? { ...item, dishName: dishName.trim(), description: description.trim(), course, price: Number(price).toFixed(2) }
          : item
      );
      setMenuItems(updatedItems);
      Alert.alert("Updated", `${dishName.trim()} has been updated!`);
    } else {
      // --- ADD NEW ITEM (Part 2) ---
      const newItem = {
        id: Date.now().toString(),
        dishName: dishName.trim(),
        description: description.trim(),
        course,
        price: Number(price).toFixed(2),
      };
      setMenuItems([...menuItems, newItem]);
      Alert.alert("Success", `${newItem.dishName} added to menu!`);
    }
    clearForm();
  };

  // PART 3 - Requirement 1: Edit - load item into form
  const handleEditItem = (item) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setEditingId(item.id);
    setErrors({});
  };

  // PART 3 - Requirement 1: Delete with confirmation
  const handleDeleteItem = (item) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.dishName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: () => {
            setMenuItems(menuItems.filter((m) => m.id !== item.id));
            // If we were editing the deleted item, clear the form
            if (editingId === item.id) clearForm();
            Alert.alert("Deleted", `${item.dishName} has been deleted.`);
          }
        }
      ]
    );
  };

  // PART 3 - Requirement 2: Search + Filter logic
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.dishName.toLowerCase().includes(searchText.toLowerCase().trim());
    const matchesCourse = filterCourse === 'All' || item.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const handleClearSearchFilter = () => {
    setSearchText('');
    setFilterCourse('All');
  };

  // PART 3 - Requirement 3: Menu Statistics
  const totalItems = menuItems.length;
  const averagePrice = totalItems === 0 ? 0 : (menuItems.reduce((sum, item) => sum + Number(item.price), 0) / totalItems).toFixed(2);
  const starterCount = menuItems.filter((i) => i.course === 'Starter').length;
  const mainCount = menuItems.filter((i) => i.course === 'Main Course').length;
  const dessertCount = menuItems.filter((i) => i.course === 'Dessert').length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Christobel's Menu Manager</Text>
      <Text style={styles.subtitle}>Chef's Mobile Menu</Text>

      {/* ===== STATISTICS BOX - Requirement 3 ===== */}
      <View style={styles.statsBox}>
        <Text style={styles.sectionTitle}>Menu Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNumber}>{totalItems}</Text><Text style={styles.statLabel}>Total Items</Text></View>
          <View style={styles.statItem}><Text style={styles.statNumber}>R {averagePrice}</Text><Text style={styles.statLabel}>Average Price</Text></View>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.courseStat}>Starters: {starterCount}</Text>
          <Text style={styles.courseStat}>Mains: {mainCount}</Text>
          <Text style={styles.courseStat}>Desserts: {dessertCount}</Text>
        </View>
        {totalItems === 0 && <Text style={styles.emptyText}>Add items to see statistics.</Text>}
      </View>

      {/* ===== FORM - Part 2 + Edit mode ===== */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>{editingId ? 'Edit Menu Item' : 'Add New Dish'}</Text>

        <Text style={styles.label}>Dish Name *</Text>
        <TextInput style={[styles.input, errors.dishName && styles.inputError]} placeholder="e.g. Grilled Lamb Chops" value={dishName} onChangeText={setDishName} />
        {errors.dishName && <Text style={styles.errorText}>{errors.dishName}</Text>}

        <Text style={styles.label}>Description *</Text>
        <TextInput style={[styles.input, styles.textArea, errors.description && styles.inputError]} placeholder="Describe the dish" value={description} onChangeText={setDescription} multiline={true} numberOfLines={3} />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={course} onValueChange={(value) => setCourse(value)}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (R) *</Text>
        <TextInput style={[styles.input, errors.price && styles.inputError]} placeholder="e.g. 150" value={price} onChangeText={setPrice} keyboardType="numeric" />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSaveItem}>
          <Text style={styles.buttonText}>{editingId ? 'Update Item' : 'Add to Menu'}</Text>
        </TouchableOpacity>

        {editingId && (
          <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
            <Text style={styles.cancelButtonText}>Cancel Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ===== SEARCH & FILTER - Requirement 2 ===== */}
      <View style={styles.searchBox}>
        <Text style={styles.sectionTitle}>Search & Filter</Text>
        <TextInput style={styles.input} placeholder="Search by dish name..." value={searchText} onChangeText={setSearchText} />
        <Text style={styles.label}>Filter by Course</Text>
        <View style={styles.filterRow}>
          {['All', 'Starter', 'Main Course', 'Dessert'].map((c) => (
            <TouchableOpacity key={c} style={[styles.filterChip, filterCourse === c && styles.filterChipActive]} onPress={() => setFilterCourse(c)}>
              <Text style={[styles.filterChipText, filterCourse === c && styles.filterChipTextActive]}>{c === 'Main Course' ? 'Main' : c}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {(searchText !== '' || filterCourse !== 'All') && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearSearchFilter}>
            <Text style={styles.clearButtonText}>Clear Search & Filter</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ===== DISPLAY LIST ===== */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Current Menu ({filteredItems.length} of {totalItems})</Text>
        {menuItems.length === 0 ? (
          <Text style={styles.emptyText}>No menu items added yet. Add your first dish above!</Text>
        ) : filteredItems.length === 0 ? (
          <Text style={styles.emptyText}>No items match your search / filter. Try clearing it.</Text>
        ) : (
          <FlatList data={filteredItems} renderItem={({ item }) => <MenuItemCard item={item} onEdit={handleEditItem} onDelete={handleDeleteItem} />} keyExtractor={item => item.id} scrollEnabled={false} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50' },
  subtitle: { fontSize: 14, textAlign: 'center', color: '#7f8c8d', marginBottom: 20 },
  form: { backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 10, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#2c3e50' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff' },
  textArea: { height: 80, textAlignVertical: 'top' },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: 3 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 5 },
  button: { backgroundColor: '#e67e22', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { backgroundColor: '#ecf0f1', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#2c3e50', fontWeight: 'bold' },
  listSection: { margin: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#95a5a6', marginTop: 20, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#e67e22' },
  cardCourse: { fontSize: 12, color: '#fff', backgroundColor: '#3498db', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 5 },
  cardDesc: { fontSize: 14, color: '#555', marginTop: 5 },
  cardButtons: { flexDirection: 'row', marginTop: 10, gap: 10 },
  smallButton: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center' },
  editButton: { backgroundColor: '#3498db' },
  deleteButton: { backgroundColor: '#e74c3c' },
  smallButtonText: { color: '#fff', fontWeight: 'bold' },
  statsBox: { backgroundColor: '#fff', margin: 15, marginBottom: 0, padding: 15, borderRadius: 10, elevation: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statItem: { flex: 1, alignItems: 'center', backgroundColor: '#f8f9fa', padding: 10, borderRadius: 8, marginHorizontal: 3 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#e67e22' },
  statLabel: { fontSize: 12, color: '#7f8c8d' },
  courseStat: { fontSize: 13, fontWeight: '600', color: '#2c3e50' },
  searchBox: { backgroundColor: '#fff', margin: 15, marginBottom: 0, padding: 15, borderRadius: 10, elevation: 2 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 5 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f8f9fa' },
  filterChipActive: { backgroundColor: '#e67e22', borderColor: '#e67e22' },
  filterChipText: { color: '#2c3e50', fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  clearButton: { backgroundColor: '#ecf0f1', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  clearButtonText: { color: '#2c3e50', fontWeight: 'bold' },
});
