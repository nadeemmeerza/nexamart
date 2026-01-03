'use client';

import React, { useState, useCallback } from 'react';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import styles from './Inventory.module.css';
import { InventoryItem } from '@/app/types/inventory.types';
import Image from 'next/image';
// import { INVENTORY_THRESHOLDS } from '@/constants/adminConstants';


interface InventoryTableProps {
  items: InventoryItem[];
  onUpdate: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onUpdate,
  onDelete,
  isLoading = false,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const handleEdit = useCallback((item: InventoryItem) => {
    setEditingId(item.id);
    setEditValue(item.quantity);
  }, []);

  const handleSave = useCallback(
    (id: string) => {
      onUpdate(id, editValue);
      setEditingId(null);
    },
    [editValue, onUpdate]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return styles.statusInStock;
      case 'low-stock':
        return styles.statusLowStock;
      case 'out-of-stock':
        return styles.statusOutOfStock;
      default:
        return '';
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
            <th>Status</th>
            <th>Last Restocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className={item.status === 'low-stock' ? styles.rowAlert : ''}>
              <td className={styles.productCell}>
                <div className={styles.productInfo}>
                  <Image className={styles.productEmoji} src={item.product?.images[0] as string} width={70} height={70} alt={"product image"}/>
                  <div>
                    <p className={styles.productName}>{item.product?.name}</p>
                    <p className={styles.productCategory}>{item.product?.category}</p>
                  </div>
                </div>
              </td>
              <td>SKU-{item.productId}</td>
              <td>
                {editingId === item.id ? (
                  <div className={styles.editInput}>
                    <input
                      type="number"
                      min="0"
                      value={editValue}
                      onChange={e => setEditValue(Number(e.target.value))}
                      className={styles.input}
                    />
                    <button
                      onClick={() => handleSave(item.id)}
                      className={styles.saveButton}
                      disabled={isLoading}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span className={styles.quantity}>{item.quantity}</span>
                )}
              </td>
              <td>{item.reorderLevel}</td>
              <td>
                <span className={`${styles.status} ${getStatusColor(item.status)}`}>
                  {item.status === 'low-stock' && <AlertCircle className="w-4 h-4" />}
                  {item.status.replace('-', ' ')}
                </span>
              </td>
             
              <td>{new Date(item.lastRestocked as Date).toLocaleDateString()}</td>
              <td className={styles.actions}>
                <button
                  onClick={() => handleEdit(item)}
                  className={styles.actionButton}
                  title="Edit"
                  disabled={editingId !== null || isLoading}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className={`${styles.actionButton} ${styles.danger}`}
                  title="Delete"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};