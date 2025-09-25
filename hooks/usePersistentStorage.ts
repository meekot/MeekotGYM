import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

export const usePersistentStorage = <T,>(
  key: string,
  initialValue: T
): [T, SetValue<T>, boolean] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null && isMounted) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Failed to read ${key} from AsyncStorage`, error);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadValue();

    return () => {
      isMounted = false;
    };
  }, [key]);

  const setValue: SetValue<T> = useCallback(
    (valueOrUpdater) => {
      setStoredValue((prevValue) => {
        const valueToStore =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (val: T) => T)(prevValue)
            : valueOrUpdater;

        AsyncStorage.setItem(key, JSON.stringify(valueToStore)).catch((error) => {
          console.error(`Failed to write ${key} to AsyncStorage`, error);
        });

        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue, isHydrated];
};
