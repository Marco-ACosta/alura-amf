import { Drawer } from 'expo-router/drawer'
import { SQLiteProvider } from "expo-sqlite"
import { StatusBar } from 'expo-status-bar'
import AuthContextComponent from "@/contexts/AuthContext"
import InitialContextComponent from "@/contexts/InitialContext"
import React from "react"
import SqliteDbManager from "@/db/database"
import SyncContextComponent from "@/contexts/SyncContext"

const DrawerScreensStyle = {
  /** Cor do ícone do drawer e título */
  headerTintColor: "white",
  /** Cor do título da aba selecionada na section do drawer */
  drawerActiveTintColor: "white",
  /** Cor dos títulos das abas não selecionadas na section do drawer */
  drawerInactiveTintColor: "grey",
  /** Cor do header */
  headerStyle: { backgroundColor: "darkblue" },
  /** Cor de fundo do drawer aberto */
  drawerStyle: { backgroundColor: "darkblue" },
}

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="database.db"
      onInit={ SqliteDbManager }
    >
      <InitialContextComponent>
        <StatusBar />
        <AuthContextComponent>
          <SyncContextComponent>
            <Drawer
              initialRouteName='(stack)'
              screenOptions={ DrawerScreensStyle }
            >
              <Drawer.Screen name='(stack)' options={{ title: "Home" }}/>
              <Drawer.Screen name='credits' options={{ title: "Créditos" }}/>
            </Drawer>
          </SyncContextComponent>
        </AuthContextComponent>
      </InitialContextComponent>
    </SQLiteProvider>
  )
}
