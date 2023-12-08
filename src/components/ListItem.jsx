import axios from "axios";
import { types } from "../constants/constants";
import { formatDate } from "../constants/helpers";
import { useState, useRef } from "react";

const ListItem = ({ todo, setTodos }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  /* referansı tanımlanan elemanlara erişme */

  const titleRef = useRef();
  const selectRef = useRef();

  //!silme işlemi
  const handleDelete = () => {
    // veritabanından sil
    axios
      .delete(`http://localhost:4000/todos/${todo.id}`)
      // istek başarılı olursa arayüzü güncelle
      .then(() => setTodos((todos) => todos.filter((i) => i.id !== todo.id)));
  };

  // güncelleme
  const handleEdit = () => {
    const newValues = {
      title: titleRef.current.value,
      status: selectRef.current.value,
    };
    // apiyi güncelle
    axios
      .patch(`http://localhost:4000/todos/${todo.id}`, newValues)
      // statei güncelle
      .then(() => {
        // todo objesini güncellemek
        const updated = { ...todo, ...newValues };
        // statede tuttuğumuz dizideki eski obje yerine updatedı ekle
        setTodos((todos) =>
          todos.map((i) => (i.id === updated.id ? updated : i))
        );
      });
    setIsEditMode(false);
  };

  return (
    <li className="position-relative  list-group-item p-3 d-flex align align-items-center justify-content-between ">
      {/* Durum alanı */}
      <div>
        {isEditMode ? (
          <select
            ref={selectRef}
            className="form-select"
            defaultValue={todo.status}
          >
            <option value="important">Önemli</option>
            <option value="daily">Günlük</option>
            <option value="job">İş</option>
          </select>
        ) : (
          <span className={`badge ${types[todo.status]?.color}`}>
            {types[todo.status].text}
          </span>
        )}
      </div>

      {/* yazı içeriği alanı */}
      {isEditMode ? (
        <input
          className="form-control w-50"
          ref={titleRef}
          type="text"
          autoFocus
          defaultValue={todo.title}
        />
      ) : (
        <span> {todo.title}</span>
      )}

      {/* Button alanı */}
      <div className="btn-group">
        {isEditMode ? (
          <>
            <button onClick={handleEdit} className="btn btn-sm btn-success">
              Kayıt
            </button>
            <button
              onClick={() => setIsEditMode(false)}
              className="btn btn-sm btn-secondary"
            >
              İptal
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
              }}
              className="btn btn-primary btn-sm"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger btn-sm">
              Del
            </button>
          </>
        )}
      </div>

      {/* Tarih alanı */}
      <span className="date">{formatDate(todo.date)}</span>
    </li>
  );
};

export default ListItem;
