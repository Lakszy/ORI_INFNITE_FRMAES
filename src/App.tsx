import { Title,  GridResults } from './components';
import { Form } from './components';
import { useFormQuery } from "./hooks";
import { ImageGallery } from './utils/defIndex';

const App = () => {

  const { handleLoading, handleSubmit, isLoading, query } = useFormQuery()

  return (
    <div>
      <Title />
      
      <Form handleSubmit={handleSubmit} isLoading={isLoading} />

      {query.length > 0 ? <GridResults query={query} handleLoading={handleLoading}/> :<ImageGallery/>}
    </div>
  )
}
export default App
