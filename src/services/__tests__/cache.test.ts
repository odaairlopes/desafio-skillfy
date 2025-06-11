/**
 * @jest-environment jsdom
 */
import { cacheManager } from "../cache";

// Mock do localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

// Mock do console.warn
const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

// Mock do Date.now para controlar o tempo nos testes
const mockDateNow = jest.spyOn(Date, "now");

// Mock do setInterval e clearInterval
jest.useFakeTimers();

describe("CacheManager", () => {
  beforeEach(() => {
    // Reset do cache antes de cada teste
    cacheManager.clear();

    // Reset do localStorage mock
    mockLocalStorage.clear();
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Reset dos mocks
    jest.clearAllMocks();
    consoleWarnSpy.mockClear();

    // Set um timestamp base
    mockDateNow.mockReturnValue(1000000); // Timestamp base
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    consoleWarnSpy.mockRestore();
    mockDateNow.mockRestore();
  });

  describe("Operações Básicas de Cache", () => {
    it("deve armazenar e recuperar dados", () => {
      const testData = { id: 1, name: "Test" };
      const key = "test-key";

      cacheManager.set(key, testData);
      const result = cacheManager.get<typeof testData>(key);

      expect(result).toEqual(testData);
    });

    it("deve retornar null para chave inexistente", () => {
      const result = cacheManager.get("non-existent-key");
      expect(result).toBeNull();
    });

    it("deve armazenar diferentes tipos de dados", () => {
      const stringData = "test string";
      const numberData = 42;
      const arrayData = [1, 2, 3];
      const objectData = { nested: { value: true } };

      cacheManager.set("string", stringData);
      cacheManager.set("number", numberData);
      cacheManager.set("array", arrayData);
      cacheManager.set("object", objectData);

      expect(cacheManager.get<string>("string")).toBe(stringData);
      expect(cacheManager.get<number>("number")).toBe(numberData);
      expect(cacheManager.get<number[]>("array")).toEqual(arrayData);
      expect(cacheManager.get<typeof objectData>("object")).toEqual(objectData);
    });

    it("deve sobrescrever dados existentes", () => {
      const key = "overwrite-key";
      const originalData = "original";
      const newData = "updated";

      cacheManager.set(key, originalData);
      expect(cacheManager.get<string>(key)).toBe(originalData);

      cacheManager.set(key, newData);
      expect(cacheManager.get<string>(key)).toBe(newData);
    });
  });

  describe("TTL (Time To Live)", () => {
    it("deve usar TTL padrão quando não especificado", () => {
      const key = "default-ttl-key";
      const data = "test data";

      // Clear cache first to ensure clean state
      cacheManager.clear();

      // Set base timestamp and add item
      const baseTime = 1000000;
      const defaultTTL = 5 * 60 * 1000; // 5 minutes in ms

      mockDateNow.mockReturnValue(baseTime);
      cacheManager.set(key, data);

      // Should be valid initially
      expect(cacheManager.get<string>(key)).toBe(data);

      // Should still be valid before expiration (4 minutes)
      mockDateNow.mockReturnValue(baseTime + 4 * 60 * 1000);
      expect(cacheManager.get<string>(key)).toBe(data);

      // Should be expired after default TTL (6 minutes)
      mockDateNow.mockReturnValue(baseTime + 6 * 60 * 1000);
      expect(cacheManager.get<string>(key)).toBeNull();
    });

    // Alternativa: Teste mais específico
    it("deve usar TTL padrão quando não especificado (alternativo)", () => {
      const key = "default-ttl-key-alt";
      const data = "test data";

      // Limpar cache primeiro
      cacheManager.clear();

      // Set timestamp fixo e adicionar item
      const baseTime = 1000000;
      const defaultTTL = 5 * 60 * 1000; // 5 minutos em ms

      mockDateNow.mockReturnValue(baseTime);
      cacheManager.set(key, data);

      // Verificar que está lá
      mockDateNow.mockReturnValue(baseTime);
      expect(cacheManager.get<string>(key)).toBe(data);

      // Testar no limite (exatamente no TTL)
      mockDateNow.mockReturnValue(baseTime + defaultTTL);
      expect(cacheManager.get<string>(key)).toBeNull();
    });

    // Teste ainda mais específico com TTL customizado
    it("deve expirar com TTL customizado conhecido", () => {
      const key = "custom-expire-key";
      const data = "test data";
      const customTTL = 5000; // 5 segundos

      // Limpar cache
      cacheManager.clear();

      // Set timestamp e adicionar com TTL específico
      const baseTime = 2000000;
      mockDateNow.mockReturnValue(baseTime);
      cacheManager.set(key, data, customTTL);

      // Verificar que está lá
      expect(cacheManager.get<string>(key)).toBe(data);

      // Antes da expiração
      mockDateNow.mockReturnValue(baseTime + customTTL - 1000); // 1s antes
      expect(cacheManager.get<string>(key)).toBe(data);

      // Depois da expiração
      mockDateNow.mockReturnValue(baseTime + customTTL + 1000); // 1s depois
      expect(cacheManager.get<string>(key)).toBeNull();
    });
  });

  describe("Operações de Remoção", () => {
    it("deve deletar item específico", () => {
      const key = "delete-key";
      const data = "delete data";

      cacheManager.set(key, data);
      expect(cacheManager.get<string>(key)).toBe(data);

      const deleted = cacheManager.delete(key);
      expect(deleted).toBe(true);
      expect(cacheManager.get<string>(key)).toBeNull();
    });

    it("deve retornar false ao tentar deletar chave inexistente", () => {
      const deleted = cacheManager.delete("non-existent");
      expect(deleted).toBe(false);
    });

    it("deve limpar todo o cache", () => {
      cacheManager.set("key1", "data1");
      cacheManager.set("key2", "data2");
      cacheManager.set("key3", "data3");

      // Verificar que os dados estão lá
      expect(cacheManager.get<string>("key1")).toBe("data1");
      expect(cacheManager.get<string>("key2")).toBe("data2");
      expect(cacheManager.get<string>("key3")).toBe("data3");

      cacheManager.clear();

      // Verificar que tudo foi removido
      expect(cacheManager.get<string>("key1")).toBeNull();
      expect(cacheManager.get<string>("key2")).toBeNull();
      expect(cacheManager.get<string>("key3")).toBeNull();
    });
  });

  describe("Persistência no localStorage", () => {
    it("deve persistir cache no localStorage", () => {
      const testData = { id: 1, name: "Persistent Test" };
      cacheManager.set("persist-key", testData);

      cacheManager.persist();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "skillfy-cache",
        expect.any(String)
      );

      // Verificar se os dados foram serializados corretamente
      const setItemCall = (mockLocalStorage.setItem as jest.Mock).mock.calls[0];
      const serializedData = setItemCall[1];
      const parsedData = JSON.parse(serializedData);

      expect(Array.isArray(parsedData)).toBe(true);
      expect(parsedData.length).toBe(1);
      expect(parsedData[0][0]).toBe("persist-key"); // chave
      expect(parsedData[0][1].data).toEqual(testData); // dados
    });

    it("deve restaurar cache do localStorage", () => {
      const testData = { id: 2, name: "Restore Test" };
      const cacheEntry = {
        data: testData,
        timestamp: 1000000,
        ttl: 300000, // 5 minutos
      };

      const cacheEntries = [["restore-key", cacheEntry]];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheEntries));

      cacheManager.restore();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("skillfy-cache");
      expect(cacheManager.get<typeof testData>("restore-key")).toEqual(
        testData
      );
    });

    it("deve limpar itens expirados ao restaurar", () => {
      const validData = { id: 1, name: "Valid" };
      const expiredData = { id: 2, name: "Expired" };

      const cacheEntries = [
        [
          "valid-key",
          {
            data: validData,
            timestamp: 1000000,
            ttl: 300000, // 5 minutos
          },
        ],
        [
          "expired-key",
          {
            data: expiredData,
            timestamp: 900000, // Mais antigo
            ttl: 50000, // TTL menor, vai expirar
          },
        ],
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cacheEntries));

      // Definir tempo atual para que expired-key expire
      mockDateNow.mockReturnValue(1000000);

      cacheManager.restore();

      expect(cacheManager.get<typeof validData>("valid-key")).toEqual(
        validData
      );
      expect(cacheManager.get<typeof expiredData>("expired-key")).toBeNull();
    });

    it("deve lidar com localStorage vazio", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      expect(() => cacheManager.restore()).not.toThrow();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("skillfy-cache");
    });

    it("deve lidar com dados corrompidos no localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid json data");

      expect(() => cacheManager.restore()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to restore cache:",
        expect.any(Error)
      );
    });

    it("deve lidar com erro ao persistir no localStorage", () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      cacheManager.set("test", "data");

      expect(() => cacheManager.persist()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to persist cache:",
        expect.any(Error)
      );
    });
  });

  describe("Ambiente Server-Side", () => {
    it("deve lidar com ambiente sem window (server-side)", () => {
      // Simular ambiente server-side
      const originalWindow = global.window;
      delete (global as any).window;

      expect(() => cacheManager.persist()).not.toThrow();
      expect(() => cacheManager.restore()).not.toThrow();

      // Restaurar window
      global.window = originalWindow;
    });

    it("não deve chamar localStorage quando window é undefined", () => {
      const originalWindow = global.window;
      delete (global as any).window;

      cacheManager.set("test", "data");
      cacheManager.persist();

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

      // Restaurar window
      global.window = originalWindow;
    });
  });

  describe("Auto-persistência", () => {
    it("deve configurar auto-persistência quando há window", () => {
      // Como o módulo já foi importado, vamos verificar se setInterval foi chamado
      // durante a inicialização (isso acontece no arquivo original)

      // Avançar timers para verificar se a auto-persistência funciona
      cacheManager.set("auto-persist", "test data");

      // Avançar 30 segundos (intervalo de auto-persistência)
      jest.advanceTimersByTime(30000);

      // Verificar se persist foi chamado (indiretamente através do localStorage)
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it("deve persistir automaticamente em intervalos regulares", () => {
      cacheManager.set("interval-test", "data");

      // Verificar múltiplos intervalos
      jest.advanceTimersByTime(30000); // 30s
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(30000); // 60s total
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(30000); // 90s total
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3);
    });
  });

  describe("Casos Extremos", () => {
    it("deve lidar com chaves vazias", () => {
      cacheManager.set("", "empty key data");
      expect(cacheManager.get<string>("")).toBe("empty key data");
    });

    it("deve lidar com dados null/undefined", () => {
      cacheManager.set("null-data", null);
      cacheManager.set("undefined-data", undefined);

      expect(cacheManager.get("null-data")).toBeNull();
      expect(cacheManager.get("undefined-data")).toBeUndefined();
    });

    it("deve lidar com TTL zero ou negativo", () => {
      cacheManager.set("zero-ttl", "data", 0);
      cacheManager.set("negative-ttl", "data", -1000);

      // Com TTL zero ou negativo, dados devem expirar imediatamente
      expect(cacheManager.get<string>("zero-ttl")).toBeNull();
      expect(cacheManager.get<string>("negative-ttl")).toBeNull();
    });

    it("deve lidar com objetos circulares na serialização", () => {
      const circularObj: any = { name: "test" };
      circularObj.self = circularObj;

      cacheManager.set("circular", circularObj);

      // Mock JSON.stringify para simular erro de circular reference
      const originalStringify = JSON.stringify;
      jest.spyOn(JSON, "stringify").mockImplementation(() => {
        throw new Error("Converting circular structure to JSON");
      });

      expect(() => cacheManager.persist()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to persist cache:",
        expect.any(Error)
      );

      // Restaurar JSON.stringify
      (JSON.stringify as jest.Mock).mockRestore();
    });

    it("deve lidar com grandes volumes de dados", () => {
      const largeData = "x".repeat(1000000); // 1MB string

      cacheManager.set("large-data", largeData);
      expect(cacheManager.get<string>("large-data")).toBe(largeData);
    });

    it("deve manter integridade dos dados com tipos complexos", () => {
      const complexData = {
        string: "test",
        number: 42,
        boolean: true,
        array: [1, "two", { three: 3 }],
        nested: {
          deep: {
            value: "deeply nested",
            date: new Date().toISOString(),
          },
        },
        nullValue: null,
        undefinedValue: undefined,
      };

      cacheManager.set("complex", complexData);
      const retrieved = cacheManager.get<typeof complexData>("complex");

      expect(retrieved).toEqual(complexData);
    });

    it("deve lidar com mudanças no timestamp do sistema", () => {
      const key = "timestamp-test";
      const data = "test data";

      // Definir item no cache
      mockDateNow.mockReturnValue(1000000);
      cacheManager.set(key, data, 60000); // 1 minuto TTL

      // Simular volta no tempo (timestamp menor)
      mockDateNow.mockReturnValue(500000);
      expect(cacheManager.get<string>(key)).toBe(data); // Ainda deve estar válido

      // Avançar para frente novamente
      mockDateNow.mockReturnValue(1000000 + 120000); // 2 minutos depois
      expect(cacheManager.get<string>(key)).toBeNull(); // Agora deve expirar
    });
  });

  describe("Performance e Memória", () => {
    it("deve limpar memória ao deletar itens expirados", () => {
      const keys = Array.from({ length: 100 }, (_, i) => `key-${i}`);

      // Adicionar muitos itens com TTL curto
      keys.forEach((key, index) => {
        cacheManager.set(key, `data-${index}`, 1000);
      });

      // Avançar tempo para expirar tudo
      mockDateNow.mockReturnValue(1000000 + 2000);

      // Acessar um item para triggerar limpeza
      expect(cacheManager.get<string>("key-0")).toBeNull();

      // Acessar outros itens também deve retornar null
      keys.slice(1, 10).forEach((key) => {
        expect(cacheManager.get<string>(key)).toBeNull();
      });
    });

    it("deve manter performance com muitas operações", () => {
      const startTime = performance.now();

      // Fazer muitas operações
      for (let i = 0; i < 1000; i++) {
        const key = `perf-key-${i}`;
        cacheManager.set(key, `data-${i}`);
        cacheManager.get<string>(key);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Operações devem ser rápidas (menos que 100ms para 1000 operações)
      expect(duration).toBeLessThan(100);
    });
  });
});
