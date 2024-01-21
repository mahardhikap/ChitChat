import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

export function Auth({ children }) {
  const token = localStorage.getItem('token');
  try {
    jwtDecode(token);
  } catch (error) {
    if (error) {
      return <Navigate to="/home" replace="true" />;
    }
  }
  return children;
}
