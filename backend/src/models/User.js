import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { UserRole } from './UserRole.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  client_id: { type: DataTypes.UUID, allowNull: true },
  full_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM(...Object.values(UserRole)), defaultValue: UserRole.USER },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'users',
});

export default User;