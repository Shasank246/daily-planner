import React, { useState } from 'react';
import { Calendar, Clock, List, Plus, Star, Trash2, AlertCircle, Filter } from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';
type TimeSlot = { id: string; time: string; task: string; priority: Priority };
type Task = {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedTask, setSelectedTask] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const priorityColors = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-green-600 bg-green-50'
  };

  const priorityBorders = {
    high: 'border-red-200',
    medium: 'border-yellow-200',
    low: 'border-green-200'
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: crypto.randomUUID(),
        title: newTask,
        priority: selectedPriority,
        completed: false
      }
    ]);
    setNewTask('');
  };

  const addTimeSlot = () => {
    if (!selectedTask) return;
    const task = tasks.find(t => t.title === selectedTask);
    if (!task) return;

    setTimeSlots([
      ...timeSlots,
      {
        id: crypto.randomUUID(),
        time: selectedTime,
        task: selectedTask,
        priority: task.priority
      }
    ]);
    setSelectedTask('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const filteredTasks = tasks.filter(task => 
    priorityFilter === 'all' ? true : task.priority === priorityFilter
  );

  const getPriorityLabel = (priority: Priority) => {
    const labels = {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority'
    };
    return labels[priority];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-indigo-600" />
            Daily Planner
          </h1>
          <p className="text-gray-600 mt-2">Organize your day by priority</p>
        </header>

        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          {/* Sidebar - Tasks */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-indigo-600" />
                Tasks
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add new task"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <button
                  onClick={addTask}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Filter by priority:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPriorityFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    priorityFilter === 'all'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  All
                </button>
                {(['high', 'medium', 'low'] as Priority[]).map(priority => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      priorityFilter === priority
                        ? priorityColors[priority]
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${priorityBorders[task.priority]} flex items-center justify-between ${
                    task.completed ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      {task.title}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                  No tasks found
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Schedule */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-indigo-600" />
                Daily Schedule
              </h2>
              <div className="flex gap-3 mb-4">
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a task</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.title}>
                      {task.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addTimeSlot}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add to Schedule
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {timeSlots
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(slot => (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-lg border ${priorityBorders[slot.priority]} flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-indigo-600">{slot.time}</span>
                      <span>{slot.task}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[slot.priority]}`}>
                        {getPriorityLabel(slot.priority)}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTimeSlot(slot.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              {timeSlots.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  No scheduled tasks yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;