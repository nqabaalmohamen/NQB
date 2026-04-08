import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Check, Clock, User, FileText, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';

const MessagesManager = () => {
  const { messages, updateMessages } = useData();

  const toggleRead = (id: number) => {
    const newMessages = messages.map(msg => 
      msg.id === id ? { ...msg, read: !msg.read } : msg
    );
    updateMessages(newMessages);
  };

  const deleteMessage = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      const newMessages = messages.filter(msg => msg.id !== id);
      updateMessages(newMessages);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-800 flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" /> رسائل التواصل
            </h1>
            <p className="text-gray-500 mt-1">عرض وإدارة الرسائل الواردة من السادة المحامين والمواطنين</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-primary">
            إجمالي الرسائل: {messages.length}
          </div>
        </div>

        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`bg-white rounded-2xl shadow-sm border-r-4 transition-all overflow-hidden ${
                  msg.read ? 'border-gray-200' : 'border-secondary shadow-md'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${msg.read ? 'bg-gray-100 text-gray-400' : 'bg-secondary/20 text-secondary'}`}>
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${msg.read ? 'text-gray-600' : 'text-gray-800'}`}>{msg.name}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> رقم القيد: {msg.idNumber || 'غير متوفر'}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {msg.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mr-auto md:mr-0">
                      <button 
                        onClick={() => toggleRead(msg.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          msg.read 
                          ? 'bg-gray-100 text-gray-400 hover:bg-secondary/10 hover:text-secondary' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                        title={msg.read ? 'تمييز كغير مقروء' : 'تم مراجعتها'}
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => deleteMessage(msg.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {msg.subject || 'بدون عنوان'}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{msg.message}</p>
                    {msg.email && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-xs">
                        <span className="text-gray-400">البريد الإلكتروني للرد: </span>
                        <a href={`mailto:${msg.email}`} className="text-secondary hover:underline font-bold">{msg.email}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <MessageSquare className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">لا توجد رسائل واردة حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesManager;
