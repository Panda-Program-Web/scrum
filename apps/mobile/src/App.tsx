import React, { useState } from 'react'
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'

export default function App() {
  const [productName, setProductName] = useState('')
  const [projectName, setProjectName] = useState('')

  const handleSubmit = () => {
    console.log('submit', productName, projectName)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Scrum Management</Text>
        <Text style={styles.desc}>本ソフトウェアはスクラムチームのタスク管理ツール（デモ用）です</Text>
        <TextInput
          style={styles.input}
          placeholder="プロダクト名"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="プロジェクト名"
          value={projectName}
          onChangeText={setProjectName}
        />
        <Button title="保存する" onPress={handleSubmit} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  form: {},
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  desc: { fontSize: 12, color: '#666', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4
  }
})
