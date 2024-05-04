// コンポーネントとStateをインポート
import { useState } from "react"
import Title from "./components/Title"
import Form from "./components/Form"
import Results from "./components/Results"
import Loading from "./components/Loading"

// ResultStateの型定義
type ResultsState = {
  country: string,
  cityName: string,
  temperature: string,
  conditionText: string,
  icon: string
}

// アプリで表示する要素の定義
const App = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [city, setCity] = useState<string>("")
  const [results, setResults] = useState<ResultsState>({
    country: " ",
    cityName: " ",
    temperature: " ",
    conditionText: " ",
    icon: " "
  })
  const getWeather = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    fetch(`https://proxy-server-se1987s-projects.vercel.app/world-weather-data?${city}`)
      .then(res => res.json())
      .then(data => {
        setResults({
          country: data.location.country,
          cityName: data.location.name,
          temperature: data.current.temp_c,
          conditionText: data.current.condition.text,
          icon: data.current.condition.icon
        })
        setLoading(false)
        setCity(" ")
      })
      .catch(() => alert("エラーが発生しました。ページをリロードして、もう一度入力してください。"))
  }
  return (
    <div className="wrapper">
      <div className="container">
        <Title/>
        <Form setCity={setCity} city={city} getWeather={getWeather}/>
        {loading ? <Loading /> : <Results results={results} />}
      </div>
    </div>
  )
}

export default App