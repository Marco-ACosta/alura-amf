import { Profile } from "./src/screens/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "./src/screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Ionicons";
import InitialContextComponent from "./src/contexts/InitialContext";
import NotificationEnclosure from "./src/components/base/NotificationEnclosure";
import React from "react";
import SqliteDbManager from "./db/migrations";
import SyncContextComponent from "./src/contexts/SyncContext";
import { Login } from "./src/screens/Login";
import AuthContextComponent from "./src/contexts/AuthContext";
import UserContextComponent from "./src/contexts/UserContext";
import { EditProfile } from "./src/screens/EditProfile";
import { EditPassword } from "./src/screens/EditPassword";
import { Contents } from "./src/screens/Contents";
import ContentDetails from "./src/screens/ContentDetails";

/** Parâmetros da navegação por tab */
export type TabNavigationParams = {
  /** Componente Home da tabs */
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  EditPassword: undefined;
  Contents: undefined;
  ContentDetails: { id: string };
};

const Tab = createBottomTabNavigator<TabNavigationParams>();

const TabScreenStyle = {
  /** Cor de fundo da tab ativa */
  tabBarActiveBackgroundColor: "white",
  /** Cor de fundo das tabs inativas */
  tabBarInactiveBackgroundColor: "white",
  /** Cor de título do header da tab atual */
  headerTintColor: "white",
  /** Cor de fundo do header da tab atual */
  headerStyle: {
    backgroundColor: "darkblue",
  },
  /** Cor de fundo do footer */
  tabBarStyle: {
    backgroundColor: "white",
  },
  /** Cor do texto do tab */
  tabBarLabelStyle: {
    color: "lightblue",
  },
};

/** Componente de navegação por tab */
const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={TabScreenStyle}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={"lightblue"} size={size} />
          ),
          tabBarLabel: "Início",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Contents"
        component={Contents}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-outline" color={"lightblue"} size={size} />
          ),
          tabBarLabel: "Conteúdo",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ContentDetails"
        component={ContentDetails}
        options={{
          headerLeftLabelVisible: false,
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={"lightblue"} size={size} />
          ),
          tabBarLabel: "Perfil",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerLeftLabelVisible: false,
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="EditPassword"
        component={EditPassword}
        options={{
          headerLeftLabelVisible: false,
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

/** Parâmetros da navegação por stack */
export type StackNavigationParams = {
  /** Navegação por tabs */
  Tabs: undefined;
  Login: undefined;
  EditProfile: undefined;
  EditPassword: undefined;
  ContentDetails: { id: string };
};

const Stack = createStackNavigator<StackNavigationParams>();

const StackScreenStyle = {
  /** Cor do header */
  headerStyle: { backgroundColor: "darkblue" },
  /** Cor do título do header */
  headerTintColor: "white",
};

const App = () => {
  return (
    <SQLiteProvider databaseName="database.db" onInit={SqliteDbManager}>
      <InitialContextComponent>
        <AuthContextComponent>
          <UserContextComponent>
            <NotificationEnclosure>
              <SyncContextComponent>
                <NavigationContainer>
                  <StatusBar
                  // backgroundColor="#"
                  />
                  <Stack.Navigator
                    initialRouteName="Tabs"
                    screenOptions={StackScreenStyle}
                  >
                    <Stack.Screen
                      name="Tabs"
                      component={TabNavigator}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="Login"
                      component={Login}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="EditProfile"
                      component={EditProfile}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="EditPassword"
                      component={EditPassword}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="ContentDetails"
                      component={ContentDetails}
                      options={{ headerShown: false }}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </SyncContextComponent>
            </NotificationEnclosure>
          </UserContextComponent>
        </AuthContextComponent>
      </InitialContextComponent>
    </SQLiteProvider>
  );
};

export default App;
