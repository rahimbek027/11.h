import { Button, Input, Select } from 'antd';
import './App.css';
import Item from './components/Item';
import { useEffect, useState } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [statusUser, setStatusUser] = useState("1");
  const [refreshStudent, setRefreshStudent] = useState(false);
  const [refreshTeacher, setRefreshTeacher] = useState(false);

  const handleFetch = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('Fetch operation failed. Please check the console for details.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      surname: e.target.surname.value,
    };

    if (!data.name || !data.surname) {
      alert("Name and surname are required.");
      return;
    }

    if (statusUser === "1") {
      data.study = e.target.job0rStudy.value;
      handleFetch("http://localhost:4000/students", data).then(() => {
        setRefreshStudent(!refreshStudent);
        e.target.reset();
      });
    } else {
      data.job = e.target.job0rStudy.value;
      handleFetch("http://localhost:4000/teachers", data).then(() => {
        setRefreshTeacher(!refreshTeacher);
        e.target.reset();
      });
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/students");
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
    fetchStudents();
  }, [refreshStudent]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:4000/teachers");
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };
    fetchTeachers();
  }, [refreshTeacher]);

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit} className="w-[600px] p-5 rounded-md bg-slate-400 mx-auto mb-10 mt-5">
        <div className="flex items-center justify-between space-x-5">
          <div className="flex flex-col w-[50%] gap-5">
            <Select
              allowClear
              value={statusUser}
              size="large"
              onChange={(value) => setStatusUser(value)} 
              showSearch
              placeholder="Select a person"
              options={[
                { value: '1', label: 'Student' },
                { value: '2', label: 'Teacher' },
              ]}
            />
            <Input
              className="w-full"
              size="large"
              name="job0rStudy"
              allowClear
              type="text"
              placeholder={`Enter ${statusUser === "1" ? "study place" : "job name"}`}
            />
          </div>
          <div className="flex flex-col w-[50%] gap-5">
            <Input name="name" className="w-full" size="large" allowClear type="text" placeholder="Enter name" />
            <Input name="surname" className="w-full" size="large" allowClear type="text" placeholder="Enter surname" />
          </div>
        </div>
        <Button htmlType="submit" className="w-full mt-5 !bg-green-600" size="large" type="primary">
          Add {statusUser === "1" ? "Student" : "Teacher"}
        </Button>
      </form>
      <div className="flex justify-center gap-20 p-10">
        <ul className="bg-slate-400 p-5 rounded-md space-y-4">
          {students.map(item => (
            <Item 
              key={item.id} 
              item={item} 
              setRefreshStudent={setRefreshStudent}
              refreshStudent={refreshStudent}
              setRefreshTeacher={setRefreshTeacher} 
              refreshTeacher={refreshTeacher}
            />
          ))}
        </ul>
        <ul className="bg-slate-400 p-5 rounded-md space-y-4">
          {teachers.map(item => (
            <Item 
              key={item.id} 
              item={item} 
              setRefreshStudent={setRefreshStudent} 
              refreshStudent={refreshStudent}
              setRefreshTeacher={setRefreshTeacher} 
              refreshTeacher={refreshTeacher}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
