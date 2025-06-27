import { useState } from 'react';

const FeedbackForm = () => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Submitted:', message);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setMessage('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto p-8 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Andika ibyo ushaka</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 mb-2">
            Andika aha:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            placeholder="Andika ibitekerezo, ibibazo, cyangwa amakuru..."
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isSubmitting ? 'Ohereza...' : 'Ohereza'}
          </button>
          
          {isSubmitted && (
            <p className="text-green-600 ml-4">
              <span className="mr-2">✓</span>
              Ubutumwa bwawe bwagiye neza!
            </p>
          )}
        </div>
      </form>
      
      <p className="text-gray-500 text-sm mt-4">
        <span className="font-semibold">Icyitonderwa:</span> 
        Ntituza kohereza imeri yawe nabandi.
      </p>
    </div>
  );
};

export default FeedbackForm;