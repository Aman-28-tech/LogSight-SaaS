import { useEffect, useState } from "react";
import StatCard from "./ui/StatCard";

const Icons = {
  Logs: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h1"/>
    </svg>
  ),
  Error: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
  Service: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
};

function Counter({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const target = value || 0;
    if (target === 0) {
      setCount(0);
      return;
    }
    
    const stepTime = Math.max(10, duration / target);
    const timer = setInterval(() => {
      start += Math.ceil(target / 50);
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Stats({ total, errors, services }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StatCard 
        label="Total Ingested" 
        value={<Counter value={total} />} 
        icon={Icons.Logs}
        colorClass="blue"
        valueClassName="text-white"
      />
      <StatCard 
        label="Critical Failures" 
        value={<Counter value={errors} />} 
        icon={Icons.Error}
        colorClass="red"
        valueClassName="text-white"
      />
      <StatCard 
        label="Active Services" 
        value={<Counter value={services} />} 
        icon={Icons.Service}
        colorClass="violet"
        valueClassName="text-white"
      />
    </div>
  );
}
