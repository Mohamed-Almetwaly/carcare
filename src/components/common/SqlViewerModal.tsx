import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, X, Copy, Check, Download, FileCode, Layers, Server } from 'lucide-react';

export const SqlViewerModal: React.FC = () => {
  const { isSqlModalOpen, setIsSqlModalOpen, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'schema' | 'architecture'>('schema');

  if (!isSqlModalOpen) return null;

  const sqlCode = `-- ==========================================================
-- CarCare - Automotive Service & Maintenance Booking Platform
-- Database Schema & Sample Seed Data
-- Target Engine: MySQL 8.0+ / MariaDB 10.5+
-- ==========================================================

DROP DATABASE IF EXISTS \`carcare_db\`;
CREATE DATABASE \`carcare_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`carcare_db\`;

-- --------------------------------------------------------
-- Table structure for \`users\`
-- --------------------------------------------------------
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone\` VARCHAR(25) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  \`avatar_url\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`cars\`
-- --------------------------------------------------------
CREATE TABLE \`cars\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`brand\` VARCHAR(60) NOT NULL,
  \`model\` VARCHAR(60) NOT NULL,
  \`year\` INT UNSIGNED NOT NULL,
  \`license_plate\` VARCHAR(20) NOT NULL UNIQUE,
  \`mileage\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`color\` VARCHAR(30) DEFAULT NULL,
  \`notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_cars_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`services\`
-- --------------------------------------------------------
CREATE TABLE \`services\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`category\` VARCHAR(50) NOT NULL DEFAULT 'General',
  \`description\` TEXT NOT NULL,
  \`estimated_price\` DECIMAL(10,2) NOT NULL,
  \`estimated_duration_mins\` INT UNSIGNED NOT NULL,
  \`icon_name\` VARCHAR(50) NOT NULL DEFAULT 'Wrench',
  \`image_url\` VARCHAR(255) DEFAULT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`appointments\`
-- --------------------------------------------------------
CREATE TABLE \`appointments\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`booking_reference\` VARCHAR(20) NOT NULL UNIQUE,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`car_id\` INT UNSIGNED DEFAULT NULL,
  \`service_id\` INT UNSIGNED NOT NULL,
  \`customer_name\` VARCHAR(100) NOT NULL,
  \`phone\` VARCHAR(25) NOT NULL,
  \`car_brand\` VARCHAR(60) NOT NULL,
  \`car_model\` VARCHAR(60) NOT NULL,
  \`car_year\` INT UNSIGNED NOT NULL,
  \`license_plate\` VARCHAR(20) NOT NULL,
  \`service_date\` DATE NOT NULL,
  \`service_time\` VARCHAR(20) NOT NULL,
  \`problem_description\` TEXT DEFAULT NULL,
  \`status\` ENUM('Pending', 'Confirmed', 'In Service', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  \`total_cost\` DECIMAL(10,2) NOT NULL,
  \`mechanic_notes\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_appointments_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_appointments_service\` FOREIGN KEY (\`service_id\`) REFERENCES \`services\` (\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT \`fk_appointments_car\` FOREIGN KEY (\`car_id\`) REFERENCES \`cars\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`contact_messages\`
-- --------------------------------------------------------
CREATE TABLE \`contact_messages\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(25) DEFAULT NULL,
  \`subject\` VARCHAR(150) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    showToast('MySQL schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlCode], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carcare_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded carcare_schema.sql', 'success');
  };

  return (
    <div id="sql-viewer-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div id="sql-viewer-modal" className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                MySQL Database & Full-Stack Architecture
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Portfolio Specs
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Directly maps to the PHP / Node.js backend schemas and relational tables
              </p>
            </div>
          </div>
          <button
            id="close-sql-modal-btn"
            onClick={() => setIsSqlModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100/80 border-b border-slate-200 text-xs font-semibold text-slate-600">
          <div className="flex gap-2">
            <button
              id="tab-sql-schema"
              onClick={() => setActiveTab('schema')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'schema'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              <FileCode className="w-4 h-4" />
              schema.sql (MySQL DDL)
            </button>
            <button
              id="tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'hover:bg-slate-200/70 text-slate-600'
              }`}
            >
              <Layers className="w-4 h-4" />
              Relational Architecture & Entities
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-sql-btn"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
            </button>
            <button
              id="download-sql-btn"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed select-text">
          {activeTab === 'schema' ? (
            <pre className="whitespace-pre overflow-x-auto text-emerald-400/90 font-mono">
              <code>{sqlCode}</code>
            </pre>
          ) : (
            <div className="font-sans text-slate-300 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  Full-Stack Architecture Overview
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  CarCare is engineered with strict separation of concerns. In production deployment,
                  the frontend communicates with RESTful endpoints (PHP PDO / Express) that validate
                  inputs, handle sessions, hash passwords via Bcrypt, and manage MySQL foreign-key relationships.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-blue-400 font-bold text-xs uppercase tracking-wider block mb-1">Entity 1</span>
                  <h4 className="text-sm font-bold text-white mb-2">`users`</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Primary Key: <span className="text-slate-200">id</span></li>
                    <li>• Unique Email index for fast authentication</li>
                    <li>• Role enum: <code className="text-blue-300">'customer' | 'admin'</code></li>
                    <li>• Bcrypt password hashing</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">Entity 2</span>
                  <h4 className="text-sm font-bold text-white mb-2">`cars`</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Foreign Key: <span className="text-slate-200">user_id → users.id</span> (CASCADE)</li>
                    <li>• Unique index on <span className="text-slate-200">license_plate</span></li>
                    <li>• Tracks make, model, year, and odometer mileage</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">Entity 3</span>
                  <h4 className="text-sm font-bold text-white mb-2">`services`</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Primary Key: <span className="text-slate-200">id</span></li>
                    <li>• Dynamic pricing and duration definitions</li>
                    <li>• Full Admin CRUD: Add, update rates, deactivate</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-purple-400 font-bold text-xs uppercase tracking-wider block mb-1">Entity 4</span>
                  <h4 className="text-sm font-bold text-white mb-2">`appointments`</h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• Unique <span className="text-slate-200">booking_reference</span> (e.g. CC-7182)</li>
                    <li>• Relational links to user, car, and service</li>
                    <li>• Status: Pending, Confirmed, In Service, Completed, Cancelled</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
          <span>Target Engine: MySQL 8.0+ / MariaDB 10.5+</span>
          <button
            id="close-sql-modal-bottom-btn"
            onClick={() => setIsSqlModalOpen(false)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
