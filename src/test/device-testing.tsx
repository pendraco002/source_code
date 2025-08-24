import React, { useState, useEffect } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { viewportHelpers } from './test-utils';

// Device testing utilities
export const deviceTestingSuite = {
  // Test different viewport sizes
  testViewports: async (component: React.ReactElement) => {
    const results: Array<{
      viewport: string;
      dimensions: { width: number; height: number };
      success: boolean;
      error?: string;
    }> = [];

    for (const [name, dimensions] of Object.entries(viewportHelpers.viewports)) {
      try {
        viewportHelpers.setViewportSize(dimensions.width, dimensions.height);
        
        const { unmount } = render(component);
        
        // Check if component renders without errors
        await waitFor(() => {
          expect(document.body).toBeInTheDocument();
        });

        results.push({
          viewport: name,
          dimensions,
          success: true
        });

        unmount();
      } catch (error) {
        results.push({
          viewport: name,
          dimensions,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  },

  // Test orientation changes
  testOrientationChanges: async (component: React.ReactElement) => {
    const results: Array<{
      orientation: string;
      success: boolean;
      error?: string;
    }> = [];

    const orientations = [
      { name: 'portrait', width: 375, height: 667 },
      { name: 'landscape', width: 667, height: 375 }
    ];

    for (const orientation of orientations) {
      try {
        viewportHelpers.setViewportSize(orientation.width, orientation.height);
        
        const { unmount } = render(component);
        
        // Simulate orientation change
        viewportHelpers.simulateOrientationChange();
        
        await waitFor(() => {
          expect(document.body).toBeInTheDocument();
        });

        results.push({
          orientation: orientation.name,
          success: true
        });

        unmount();
      } catch (error) {
        results.push({
          orientation: orientation.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  },

  // Test performance on different device specs
  testPerformance: async (component: React.ReactElement) => {
    const results: Array<{
      deviceType: string;
      renderTime: number;
      success: boolean;
    }> = [];

    const deviceTypes = [
      { name: 'high-end', memory: 8, cores: 8 },
      { name: 'mid-range', memory: 4, cores: 4 },
      { name: 'low-end', memory: 2, cores: 2 }
    ];

    for (const device of deviceTypes) {
      try {
        // Mock device specs
        Object.defineProperty(navigator, 'deviceMemory', { 
          value: device.memory, 
          configurable: true 
        });
        Object.defineProperty(navigator, 'hardwareConcurrency', { 
          value: device.cores, 
          configurable: true 
        });

        const startTime = performance.now();
        
        const { unmount } = render(component);
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        results.push({
          deviceType: device.name,
          renderTime,
          success: true
        });

        unmount();
      } catch (error) {
        results.push({
          deviceType: device.name,
          renderTime: -1,
          success: false
        });
      }
    }

    return results;
  }
};

// Device Test Component for UI testing
interface DeviceTestComponentProps {
  onTestComplete?: (results: any) => void;
  component: React.ReactElement;
  testTypes: ('viewport' | 'orientation' | 'performance')[];
}

export const DeviceTestComponent: React.FC<DeviceTestComponentProps> = ({
  onTestComplete,
  component,
  testTypes
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>({});
  const [currentTest, setCurrentTest] = useState<string>('');

  const runTests = async () => {
    setIsRunning(true);
    const testResults: any = {};

    try {
      for (const testType of testTypes) {
        setCurrentTest(testType);
        
        switch (testType) {
          case 'viewport':
            testResults.viewport = await deviceTestingSuite.testViewports(component);
            break;
          case 'orientation':
            testResults.orientation = await deviceTestingSuite.testOrientationChanges(component);
            break;
          case 'performance':
            testResults.performance = await deviceTestingSuite.testPerformance(component);
            break;
        }
      }
      
      setResults(testResults);
      onTestComplete?.(testResults);
    } catch (error) {
      console.error('Device testing failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Device Testing Suite</h2>
      
      <div className="mb-4">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? `Running ${currentTest}...` : 'Run Device Tests'}
        </button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="space-y-6">
          {/* Viewport Results */}
          {results.viewport && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Viewport Tests</h3>
              <div className="grid grid-cols-2 gap-4">
                {results.viewport.map((result: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 rounded border ${
                      result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="font-medium">{result.viewport}</div>
                    <div className="text-sm text-gray-600">
                      {result.dimensions.width} × {result.dimensions.height}
                    </div>
                    {result.error && (
                      <div className="text-sm text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orientation Results */}
          {results.orientation && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Orientation Tests</h3>
              <div className="grid grid-cols-2 gap-4">
                {results.orientation.map((result: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 rounded border ${
                      result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="font-medium capitalize">{result.orientation}</div>
                    {result.error && (
                      <div className="text-sm text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Results */}
          {results.performance && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Performance Tests</h3>
              <div className="grid grid-cols-3 gap-4">
                {results.performance.map((result: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 rounded border ${
                      result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="font-medium capitalize">{result.deviceType}</div>
                    {result.success && (
                      <div className="text-sm text-gray-600">
                        Render: {result.renderTime.toFixed(2)}ms
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Component Preview */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Component Preview</h3>
        <div className="border rounded-lg p-4 bg-gray-50">
          {React.cloneElement(component, { key: 'preview' })}
        </div>
      </div>
    </div>
  );
};

// UX Testing Simulator
interface UXTestScenario {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    instruction: string;
    selector?: string;
    action?: 'click' | 'input' | 'scroll' | 'wait';
    value?: string;
    expectedResult?: string;
  }>;
}

export const UXTestingSimulator: React.FC<{
  scenarios: UXTestScenario[];
  onScenarioComplete?: (scenarioId: string, success: boolean, notes: string) => void;
}> = ({ scenarios, onScenarioComplete }) => {
  const [currentScenario, setCurrentScenario] = useState<UXTestScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [notes, setNotes] = useState('');
  const [results, setResults] = useState<Record<string, { success: boolean; notes: string }>>({});

  const startScenario = (scenario: UXTestScenario) => {
    setCurrentScenario(scenario);
    setCurrentStep(0);
    setNotes('');
  };

  const completeScenario = (success: boolean) => {
    if (currentScenario) {
      const result = { success, notes };
      setResults(prev => ({ ...prev, [currentScenario.id]: result }));
      onScenarioComplete?.(currentScenario.id, success, notes);
      setCurrentScenario(null);
    }
  };

  const nextStep = () => {
    if (currentScenario && currentStep < currentScenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">UX Testing Simulator</h2>
      
      {!currentScenario ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Test Scenarios</h3>
          <div className="grid gap-4">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id}
                className="border rounded-lg p-4 hover:border-blue-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{scenario.name}</h4>
                  {results[scenario.id] && (
                    <span className={`px-2 py-1 rounded text-sm ${
                      results[scenario.id].success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {results[scenario.id].success ? 'Passed' : 'Failed'}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{scenario.description}</p>
                <div className="text-sm text-gray-500 mb-3">
                  {scenario.steps.length} steps
                </div>
                <button
                  onClick={() => startScenario(scenario)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{currentScenario.name}</h3>
            <p className="text-gray-600">{currentScenario.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Step {currentStep + 1} of {currentScenario.steps.length}
            </div>
          </div>

          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h4 className="font-medium mb-2">Current Step:</h4>
            <p className="mb-3">{currentScenario.steps[currentStep].instruction}</p>
            
            {currentScenario.steps[currentStep].expectedResult && (
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-1">Expected Result:</h5>
                <p className="text-sm text-gray-600">{currentScenario.steps[currentStep].expectedResult}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Test Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 px-3 py-2 border rounded-lg"
              placeholder="Add any observations, issues, or feedback..."
            />
          </div>

          <div className="flex justify-between">
            <div>
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 mr-2"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === currentScenario.steps.length - 1}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            
            <div>
              <button
                onClick={() => completeScenario(false)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
              >
                Mark Failed
              </button>
              <button
                onClick={() => completeScenario(true)}
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mark Passed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceTestComponent;