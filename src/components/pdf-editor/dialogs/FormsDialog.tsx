import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X, Download, Save } from 'lucide-react';

interface FormsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature';
  value: string | boolean;
  options?: string[];
  required: boolean;
  pageNumber: number;
}

export default function FormsDialog({ isOpen, onClose }: FormsDialogProps) {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      detectFormFields();
    }
  }, [isOpen]);

  const detectFormFields = async () => {
    setIsDetecting(true);
    try {
      // TODO: Implement actual form field detection API call
      console.log('Detecting form fields...');

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock form fields
      const mockFields: FormField[] = [
        {
          id: 'field-1',
          name: 'Full Name',
          type: 'text',
          value: '',
          required: true,
          pageNumber: 1,
        },
        {
          id: 'field-2',
          name: 'Email Address',
          type: 'text',
          value: '',
          required: true,
          pageNumber: 1,
        },
        {
          id: 'field-3',
          name: 'Phone Number',
          type: 'text',
          value: '',
          required: false,
          pageNumber: 1,
        },
        {
          id: 'field-4',
          name: 'Country',
          type: 'dropdown',
          value: '',
          options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Other'],
          required: true,
          pageNumber: 1,
        },
        {
          id: 'field-5',
          name: 'I agree to terms and conditions',
          type: 'checkbox',
          value: false,
          required: true,
          pageNumber: 2,
        },
        {
          id: 'field-6',
          name: 'Signature',
          type: 'signature',
          value: '',
          required: true,
          pageNumber: 2,
        },
      ];

      setFormFields(mockFields);
    } catch (error) {
      console.error('Error detecting form fields:', error);
      alert('Failed to detect form fields. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  };

  const updateFieldValue = (id: string, value: string | boolean) => {
    setFormFields(formFields.map(field =>
      field.id === id ? { ...field, value } : field
    ));
    setHasChanges(true);
  };

  const handleSaveForm = async () => {
    // Validate required fields
    const missingFields = formFields.filter(f => f.required && !f.value);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map(f => f.name).join(', ')}`);
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement actual form save API call
      const formData = formFields.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {} as Record<string, string | boolean>);

      console.log('Saving form data:', formData);

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Form data saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form data. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportData = () => {
    const formData = formFields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as Record<string, string | boolean>);

    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFlattenForm = async () => {
    if (!confirm('Flatten form? This will make form fields non-editable and permanent.')) {
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Implement actual flatten API call
      console.log('Flattening form...');

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('Form flattened successfully!');
      onClose();
    } catch (error) {
      console.error('Error flattening form:', error);
      alert('Failed to flatten form. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">PDF Forms</h3>
              <p className="text-sm text-gray-600">
                {isDetecting
                  ? 'Detecting form fields...'
                  : `${formFields.length} form field(s) detected`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        {isDetecting ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Detecting form fields...</p>
            </div>
          </div>
        ) : formFields.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg mb-6">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No form fields detected</p>
            <p className="text-sm text-gray-500">This PDF doesn't appear to have fillable form fields</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {formFields.map((field) => (
              <div key={field.id} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      {field.name}
                      {field.required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                    <p className="text-xs text-gray-500">Page {field.pageNumber}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {field.type}
                  </span>
                </div>

                {/* Field Input */}
                {field.type === 'text' && (
                  <input
                    type="text"
                    value={field.value as string}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {field.type === 'checkbox' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value as boolean}
                      onChange={(e) => updateFieldValue(field.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{field.name}</span>
                  </div>
                )}

                {field.type === 'dropdown' && (
                  <select
                    value={field.value as string}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {field.name.toLowerCase()}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === 'signature' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-sm text-gray-600">Click to add signature</p>
                    <p className="text-xs text-gray-500 mt-1">Digital signature not yet implemented</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {formFields.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={handleFlattenForm}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                Flatten Form
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveForm}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isProcessing || !hasChanges}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Form Data
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
