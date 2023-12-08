import axios from "axios";
import { v4 } from "uuid";

const Form = ({ setTodos, totalCount, maxPage, setPage, todos, params }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const status = e.target[1].value;
    if (!title) {
      return alert("Lütfen Başlık yazınız!");
    }

    /* Veritabanına eklenecek kaydedilecek veriyi hazırla */
    const newTodo = {
      title,
      status,
      id: v4(),
      date: new Date().toLocaleDateString(),
      isDone: false,
    };
    /* oluşturduğumuz yeni todoyu apiye ekleme */
    axios
      .post("http://localhost:4000/todos", newTodo)
      //api güncellenirse statei arayüzü güncelle
      .then(() => {
        // önündeki sayfa doluysa son sayfaya yönlendir
        if (todos.length === params._limit) {
          // eğerki önündeki sayfa doluysa son sayfaya yönlendir mod aldık mod 0 sa safya doludur
          setPage(totalCount % params._limit === 0 ? maxPage + 1 : maxPage);
          return;
        }
        // set methodu verdiğimiz fonksiyona param olarak statein son halini göndeririz
        setTodos((todos) => [...todos, newTodo]);
      })
      .then(() => (e.target[0].value = ""));
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex align-items-center py-4  gap-3"
    >
      <input
        className="form-control"
        placeholder="Ör:JS Projesi yap.."
        type="text"
      />
      <select defaultValue={"daily"} className="form-select w-25 ">
        <option value="important">Önemli</option>
        <option value="daily">Günlük</option>
        <option value="job">İş</option>
      </select>
      <button type="submit" className="btn btn-primary ">
        Gönder
      </button>
    </form>
  );
};

export default Form;
