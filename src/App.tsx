import './App.css'
import Header from './components/ui/custom/Header'
import Hero from './components/ui/custom/Hero'
import { ThemeProvider } from "./components/ui/custom/theme-provider"


const App = () => {

  return (
    <ThemeProvider defaultTheme="dark">
      <div>
        <Header />
        <Hero />
      </div>
    </ThemeProvider>
  )
}

export default App
