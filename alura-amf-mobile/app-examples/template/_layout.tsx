import { Drawer } from 'expo-router/drawer'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <Drawer initialRouteName='(stack)'>
        <Drawer.Screen name='(stack)' options={{ title: "Home" }}/>
        <Drawer.Screen name='credits' options={{ title: "Créditos" }}/>
      </Drawer>
      <StatusBar style="auto" />
    </>
  )
}
