import { detectEntities } from '../../src/utils/entity-detection';

describe('Entity Detection', () => {
  test('should detect company names in text', () => {
    const text = 'Google has announced a new product today. Amazon is also working on similar technology.';
    const entities = detectEntities(text);
    
    expect(entities).toHaveLength(2);
    expect(entities[0].name).toBe('Google');
    expect(entities[0].ticker).toBe('GOOG');
    expect(entities[1].name).toBe('Amazon');
    expect(entities[1].ticker).toBe('AMZN');
  });
  
  test('should detect executives and associate them with companies', () => {
    const text = 'Tim Cook announced the new iPhone today.';
    const entities = detectEntities(text);
    
    expect(entities).toHaveLength(1);
    expect(entities[0].ticker).toBe('AAPL');
  });
  
  test('should detect company subsidiaries', () => {
    const text = 'AWS has launched a new cloud service.';
    const entities = detectEntities(text);
    
    expect(entities).toHaveLength(1);
    expect(entities[0].ticker).toBe('AMZN');
  });
  
  test('should not include private companies', () => {
    const text = 'SpaceX launched a new rocket today.';
    const entities = detectEntities(text);
    
    expect(entities).toHaveLength(0);
  });
});