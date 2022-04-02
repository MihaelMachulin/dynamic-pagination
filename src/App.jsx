import {useEffect, useState} from 'react'
import axios from "axios";
import './App.css'
// https://www.youtube.com/watch?v=J2MWOhV8T6o
// Всего на фейковом сервере 5000 фотографий,
// мы их будем выводить по 10 подгружая при скролле.


function App() {
  const [photos, setPhotos] = useState([]) // Тут храним фото
  const [currentPage, setCurrentPage] = useState(1) // Текущая страница в 5000 фоток
  const [fetching, setFetching] = useState(true) // Отслеживаем процесс загрузки
  const [totalCount, setTotalCount] = useState(0) // Отслеживаем процесс загрузки

  useEffect( () => {
    if (fetching) { // Изначально true - так что первый запрос отправится
      console.log('fetching')
                   // - limit=10 по сколько загружать page= - текущая страница
      axios.get(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`)
          .then(response => {
            setPhotos([...photos,...response.data])  // Разворачиваем новые фоточки к старым - чтобы не затирались
            setCurrentPage(prevState => prevState + 1) // Следующая страница
            setTotalCount(response.headers['x-total-count']) // Получаем общее число фоток
          })
          .finally(() => setFetching(false))
    } // Следим за [fetching] и выполняем ф-ю выше, когда [fetching] меняется
      // А меняется он вычислением конца прокрутки в scrollHandler
  }, [fetching])

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler) // Вешаем слушатель
    return function () {
      document.removeEventListener('scroll', scrollHandler) // убираем слушатель
    }
  })

  const scrollHandler = (e) => {
    // Вот из этих значекий мы и будем вычислять, когда менять fetching и подгружать новые данные
    //console.log('Page height:', e.target.documentElement.scrollHeight) // Высота страницы сверху до конца скролла
    //console.log('Scroll position:', e.target.documentElement.scrollTop) // Текущее положение скролла от верха
    //console.log('Window height:', window.innerHeight) // Высота видимой области страницы

    // Вычисляем - дохождение скролла до низа страницы:    // < 100 - чтобы начать грузить заранее
    if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100
        && photos.length < totalCount) { // Проверяем массив с фотками - все ли загрузились или ещё не все
        setFetching(true)
    }
  }

  return (
    <div className={'app'}>
      {photos.map(photo =>
          <div className="photo" key={photo.id}>
            <div className="title">{photo.id}. {photo.title}</div>
            <img src={photo.thumbnailUrl} alt=""/>
          </div>
      )}
    </div>
  )
}

export default App
