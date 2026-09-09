import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Main Course');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!dishName.trim()) newErrors.dishName = "Dish name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price.trim()) newErrors.price = "Price is required";
    else if (isNaN(price) || Number(price) <= 0) newErrors.price = "Enter valid price";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = () => {
    if (!validate()) return;

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: Number(price).toFixed(2),
    };

    setMenuItems([...menuItems, newItem]);
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse('Main Course');
    setErrors({});
    Alert.alert("Success", `${newItem.dishName} added!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Christobel's Menu Manager</Text>
      <Text style={styles.subtitle}>Chef's Mobile Menu - Part 2</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Dish Name *</Text>
        <TextInput style={[styles.input, errors.dishName && styles.inputError]} placeholder="e.g. Grilled Lamb" value={dishName} onChangeText={setDishName} />
        {errors.dishName && <Text style={styles.errorText}>{errors.dishName}</Text>}

        <Text style={styles.label}>Description *</Text>
        <TextInput style={[styles.input, styles.textArea, errors.description && styles.inputError]} placeholder="Describe the dish" value={description} onChangeText={setDescription} multiline />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Course</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={course} onValueChange={setCourse} style={{height: 50}}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (R) *</Text>
        <TextInput style={[styles.input, errors.price && styles.inputError]} placeholder="e.g. 150" value={price} onChangeText={setPrice} keyboardType="numeric" />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Add to Menu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Current Menu ({menuItems.length})</Text>
      {menuItems.length === 0 ? (
        <Text style={styles.emptyText}>No menu items added yet. Add your first dish above!</Text>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.dishName}</Text>
                <Text style={styles.cardPrice}>R {item.price}</Text>
              </View>
              <Text style={styles.cardCourse}>{item.course}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15, paddingTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50' },
  subtitle: { fontSize: 13, textAlign: 'center', color: '#7f8c8d', marginBottom: 15 },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 2, marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 15 },
  textArea: { height: 70, textAlignVertical: 'top' },
  pickerBox: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 11, marginTop: 2 },
  button: { backgroundColor: '#e67e22', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { textAlign: 'center', color: '#95a5a6', marginTop: 20, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: 'bold' },
  cardPrice: { fontSize: 15, fontWeight: 'bold', color: '#e67e22' },
  cardCourse: { fontSize: 11, color: '#fff', backgroundColor: '#3498db', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4 },
  cardDesc: { fontSize: 13, color: '#555', marginTop: 4 }
});
