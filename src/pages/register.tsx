import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    studentName: '',
    age: '',
    parentName: '',
    phone: '',
    email: '',
    location: '',
    frequency: '',
    selectedDays: [],
    liabilityAccepted: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox' && name === 'liabilityAccepted') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, liabilityAccepted: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload = {
      ...form,
      age: parseInt(form.age),
      startDate: new Date().toISOString(), // Placeholder — later we’ll calculate based on school/frequency
    };
  
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    const data = await res.json();
    if (data.success) {
      alert('Registro exitoso 🎉');
      setForm({
        studentName: '',
        age: '',
        parentName: '',
        phone: '',
        email: '',
        location: '',
        frequency: '',
        selectedDays: [],
        liabilityAccepted: false,
      });
    } else {
      alert('Error al registrar. Intente de nuevo.');
    }
  };
  
  

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Formulario de Inscripción</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="studentName"
          placeholder="Nombre del estudiante"
          value={form.studentName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="age"
          placeholder="Edad"
          value={form.age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="parentName"
          placeholder="Nombre del padre/madre/tutor"
          value={form.parentName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select name="location" value={form.location} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Seleccione colegio</option>
          <option value="KATY">Katy</option>
          <option value="SUGARLAND">Sugarland</option>
        </select>

        <select name="frequency" value={form.frequency} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Frecuencia de clases</option>
          <option value="ONCE_A_WEEK">1 día a la semana</option>
          <option value="TWICE_A_WEEK">2 días a la semana</option>
        </select>

        <label className="block">
          <input
            type="checkbox"
            name="liabilityAccepted"
            checked={form.liabilityAccepted}
            onChange={handleChange}
            className="mr-2"
          />
          Acepto el descargo de responsabilidad
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white p-2 px-4 rounded hover:bg-green-700"
          disabled={!form.liabilityAccepted}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
