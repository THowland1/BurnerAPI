import { applyODataParams } from './apply-odata-params';

const testData = [
  { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
  { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
  {
    user: 'zacarias',
    color: 'indigo',
    details: { city: 'Sao Paulo', age: 44 },
  },
  { user: 'robert', color: 'yellow', details: { city: 'Zurich', age: 38 } },
  { user: 'klaus', color: 'orange', details: { city: 'Zurich', age: 38 } },
  { user: 'frank', color: 'red', details: { city: 'Frankfurt', age: 26 } },
  { user: 'maria', color: 'orange', details: { city: 'London', age: 20 } },
  { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
  { user: 'roberto', color: 'green', details: { city: 'Manchester', age: 28 } },
  { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
  { user: 'robert', color: 'azure', details: { city: 'Manchester', age: 28 } },
];

describe('applyODataParams', function () {
  it('should not alter data when no query string specified (except for default $top=10)', async function () {
    const data = applyODataParams(testData, '');
    expect(data).toStrictEqual([
      { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
      { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
      {
        user: 'zacarias',
        color: 'indigo',
        details: { city: 'Sao Paulo', age: 44 },
      },
      { user: 'robert', color: 'yellow', details: { city: 'Zurich', age: 38 } },
      { user: 'klaus', color: 'orange', details: { city: 'Zurich', age: 38 } },
      { user: 'frank', color: 'red', details: { city: 'Frankfurt', age: 26 } },
      { user: 'maria', color: 'orange', details: { city: 'London', age: 20 } },
      { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
      {
        user: 'roberto',
        color: 'green',
        details: { city: 'Manchester', age: 28 },
      },
      { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
    ]);
  });

  describe('$orderby', function () {
    it('should sort by asc by default', async function () {
      const data = applyODataParams(testData, '$orderby=user');

      expect(data).toStrictEqual([
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'robert',
          color: 'azure',
          details: { city: 'Manchester', age: 28 },
        },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
      ]);
    });
    it('should sort by asc if specified', async function () {
      const data = applyODataParams(testData, '$orderby=user asc');

      expect(data).toStrictEqual([
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'robert',
          color: 'azure',
          details: { city: 'Manchester', age: 28 },
        },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
      ]);
    });
    it('should sort by desc if specified', async function () {
      const data = applyODataParams(testData, '$orderby=user desc');

      expect(data).toStrictEqual([
        {
          user: 'zacarias',
          color: 'indigo',
          details: { city: 'Sao Paulo', age: 44 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'robert',
          color: 'azure',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
      ]);
    });

    it('should sort by muiltiple props in order of declaration', async function () {
      const data = applyODataParams(testData, '$orderby=user asc, color');

      expect(data).toStrictEqual([
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'robert',
          color: 'azure',
          details: { city: 'Manchester', age: 28 },
        },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
      ]);
    });
  });

  describe('$skip', function () {
    it('should be 0 by default', async function () {
      const data = applyODataParams(testData, '');

      expect(data).toStrictEqual([
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'zacarias',
          color: 'indigo',
          details: { city: 'Sao Paulo', age: 44 },
        },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
      ]);
    });
    it('should adhere to declared value', async function () {
      const data = applyODataParams(testData, '$skip=5');

      expect(data).toStrictEqual([
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },

        {
          user: 'robert',
          color: 'azure',
          details: { city: 'Manchester', age: 28 },
        },
      ]);
    });
    it('should be empty if value is equal to total count', async function () {
      const data = applyODataParams(testData, '$skip=11');

      expect(data).toStrictEqual([]);
    });
    it('should be empty if value is over total count', async function () {
      const data = applyODataParams(testData, '$skip=12');

      expect(data).toStrictEqual([]);
    });

    it('should go to default if less than 0', async function () {
      expect(() => {
        const data = applyODataParams(testData, '$skip=-1');

        expect(data).toStrictEqual([
          { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
          {
            user: 'max',
            color: 'yellow',
            details: { city: 'Munich', age: 29 },
          },
          {
            user: 'zacarias',
            color: 'indigo',
            details: { city: 'Sao Paulo', age: 44 },
          },
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'klaus',
            color: 'orange',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'frank',
            color: 'red',
            details: { city: 'Frankfurt', age: 26 },
          },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
          {
            user: 'sara',
            color: 'blue',
            details: { city: 'New York', age: 30 },
          },
          {
            user: 'roberto',
            color: 'green',
            details: { city: 'Manchester', age: 28 },
          },
          { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        ]);
      });
    });
    it('should throw error if not an integer', async function () {
      expect(() => applyODataParams(testData, '$skip=0.5')).toThrowError();
    });
  });

  describe('$top', function () {
    it('should be 10 by default', async function () {
      const data = applyODataParams(testData, '');

      expect(data).toStrictEqual([
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'zacarias',
          color: 'indigo',
          details: { city: 'Sao Paulo', age: 44 },
        },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
      ]);
    });
    it('should throw error if over 10', async function () {
      expect(() => applyODataParams(testData, '$top=11')).toThrowError();
    });
    it('should throw error if equal to 0', async function () {
      expect(() => applyODataParams(testData, '$top=0')).toThrowError();
    });
    it('should go to default if less than 0', async function () {
      expect(() => {
        const data = applyODataParams(testData, '$top=-1');

        expect(data).toStrictEqual([
          { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
          {
            user: 'max',
            color: 'yellow',
            details: { city: 'Munich', age: 29 },
          },
          {
            user: 'zacarias',
            color: 'indigo',
            details: { city: 'Sao Paulo', age: 44 },
          },
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'klaus',
            color: 'orange',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'frank',
            color: 'red',
            details: { city: 'Frankfurt', age: 26 },
          },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
          {
            user: 'sara',
            color: 'blue',
            details: { city: 'New York', age: 30 },
          },
          {
            user: 'roberto',
            color: 'green',
            details: { city: 'Manchester', age: 28 },
          },
          { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        ]);
      });
    });
    it('should throw error if not an integer', async function () {
      expect(() => applyODataParams(testData, '$top=0.5')).toThrowError();
    });
  });
  describe('$select', function () {
    it('should select all by default', async function () {
      const data = applyODataParams(testData, '');

      expect(data).toStrictEqual([
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'zacarias',
          color: 'indigo',
          details: { city: 'Sao Paulo', age: 44 },
        },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
      ]);
    });
    it('should select shallow prop', async function () {
      const data = applyODataParams(testData, '$select=user');

      expect(data).toStrictEqual([
        { user: 'fabio' },
        { user: 'max' },
        { user: 'zacarias' },
        { user: 'robert' },
        { user: 'klaus' },
        { user: 'frank' },
        { user: 'maria' },
        { user: 'sara' },
        { user: 'roberto' },
        { user: 'andy' },
      ]);
    });
    it('should select deep prop', async function () {
      const data = applyODataParams(testData, '$select=details/age');

      expect(data).toStrictEqual([
        { details: { age: 34 } },
        { details: { age: 29 } },
        { details: { age: 44 } },
        { details: { age: 38 } },
        { details: { age: 38 } },
        { details: { age: 26 } },
        { details: { age: 20 } },
        { details: { age: 30 } },
        { details: { age: 28 } },
        { details: { age: 38 } },
      ]);
    });
    it('should select multiple props', async function () {
      const data = applyODataParams(testData, '$select=user, details/age');

      expect(data).toStrictEqual([
        { user: 'fabio', details: { age: 34 } },
        {
          user: 'max',
          details: { age: 29 },
        },
        {
          user: 'zacarias',
          details: { age: 44 },
        },
        {
          user: 'robert',
          details: { age: 38 },
        },
        {
          user: 'klaus',
          details: { age: 38 },
        },
        {
          user: 'frank',
          details: { age: 26 },
        },
        {
          user: 'maria',
          details: { age: 20 },
        },
        {
          user: 'sara',
          details: { age: 30 },
        },
        {
          user: 'roberto',
          details: { age: 28 },
        },
        { user: 'andy', details: { age: 38 } },
      ]);
    });
  });

  describe('$filter', function () {
    it('should have no filters by default', async function () {
      const data = applyODataParams(testData, '');
      expect(data).toStrictEqual([
        { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
        { user: 'max', color: 'yellow', details: { city: 'Munich', age: 29 } },
        {
          user: 'zacarias',
          color: 'indigo',
          details: { city: 'Sao Paulo', age: 44 },
        },
        {
          user: 'robert',
          color: 'yellow',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'klaus',
          color: 'orange',
          details: { city: 'Zurich', age: 38 },
        },
        {
          user: 'frank',
          color: 'red',
          details: { city: 'Frankfurt', age: 26 },
        },
        {
          user: 'maria',
          color: 'orange',
          details: { city: 'London', age: 20 },
        },
        { user: 'sara', color: 'blue', details: { city: 'New York', age: 30 } },
        {
          user: 'roberto',
          color: 'green',
          details: { city: 'Manchester', age: 28 },
        },
        { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
      ]);
    });
    describe('eq', () => {
      it('should by able to eq filter shallow', async function () {
        const data = applyODataParams(testData, "$filter=user eq 'robert'");
        expect(data).toStrictEqual([
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'robert',
            color: 'azure',
            details: { city: 'Manchester', age: 28 },
          },
        ]);
      });
      it('should by able to eq filter deep', async function () {
        const data = applyODataParams(testData, '$filter=details/age eq 38');
        expect(data).toStrictEqual([
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'klaus',
            color: 'orange',
            details: { city: 'Zurich', age: 38 },
          },
          { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        ]);
      });
    });
    describe('lt', () => {
      it('should work', async function () {
        const data = applyODataParams(testData, '$filter=details/age lt 26');
        expect(data).toStrictEqual([
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
        ]);
      });
    });
    describe('le', () => {
      it('should work', async function () {
        const data = applyODataParams(testData, '$filter=details/age le 26');
        expect(data).toStrictEqual([
          {
            user: 'frank',
            color: 'red',
            details: { city: 'Frankfurt', age: 26 },
          },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
        ]);
      });
    });
    describe('gt', () => {
      it('should work', async function () {
        const data = applyODataParams(testData, '$filter=details/age gt 38');
        expect(data).toStrictEqual([
          {
            user: 'zacarias',
            color: 'indigo',
            details: { city: 'Sao Paulo', age: 44 },
          },
        ]);
      });
    });
    describe('ge', () => {
      it('should work', async function () {
        const data = applyODataParams(testData, '$filter=details/age ge 38');
        expect(data).toStrictEqual([
          {
            user: 'zacarias',
            color: 'indigo',
            details: { city: 'Sao Paulo', age: 44 },
          },
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'klaus',
            color: 'orange',
            details: { city: 'Zurich', age: 38 },
          },
          { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        ]);
      });
    });
    describe('ne', () => {
      it('should work', async function () {
        const data = applyODataParams(testData, '$filter=details/age ne 38');
        expect(data).toStrictEqual([
          { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
          {
            user: 'max',
            color: 'yellow',
            details: { city: 'Munich', age: 29 },
          },
          {
            user: 'zacarias',
            color: 'indigo',
            details: { city: 'Sao Paulo', age: 44 },
          },
          {
            user: 'frank',
            color: 'red',
            details: { city: 'Frankfurt', age: 26 },
          },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
          {
            user: 'sara',
            color: 'blue',
            details: { city: 'New York', age: 30 },
          },
          {
            user: 'roberto',
            color: 'green',
            details: { city: 'Manchester', age: 28 },
          },
          {
            user: 'robert',
            color: 'azure',
            details: { city: 'Manchester', age: 28 },
          },
        ]);
      });
    });
    describe('startswith', () => {
      it('should work', async function () {
        const data = applyODataParams(
          testData,
          "$filter=startswith(user, 'ma')"
        );
        expect(data).toStrictEqual([
          {
            user: 'max',
            color: 'yellow',
            details: { city: 'Munich', age: 29 },
          },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
        ]);
      });
    });
    describe('endswith', () => {
      it('should work', async function () {
        const data = applyODataParams(
          testData,
          "$filter=endswith(details/city, 'n')"
        );
        expect(data).toStrictEqual([
          { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
        ]);
      });
    });
    describe('substringof', () => {
      it('should work', async function () {
        const data = applyODataParams(
          testData,
          "$filter=substringof('n', color)"
        );
        expect(data).toStrictEqual([
          { user: 'fabio', color: 'pink', details: { city: 'Milan', age: 34 } },
          {
            user: 'zacarias',
            color: 'indigo',
            details: { city: 'Sao Paulo', age: 44 },
          },
          {
            user: 'klaus',
            color: 'orange',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
          {
            user: 'roberto',
            color: 'green',
            details: { city: 'Manchester', age: 28 },
          },
          { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
        ]);
      });
    });
    // Not supported by odata parser
    describe('not', () => {
      it.skip('should work', async function () {
        const data = applyODataParams(
          testData,
          "$filter=not substringof('n', color)"
        );
        expect(data).toStrictEqual([
          {
            user: 'max',
            color: 'yellow',
            details: { city: 'Munich', age: 29 },
          },
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'frank',
            color: 'red',
            details: { city: 'Frankfurt', age: 26 },
          },
          {
            user: 'sara',
            color: 'blue',
            details: { city: 'New York', age: 30 },
          },
          {
            user: 'robert',
            color: 'azure',
            details: { city: 'Manchester', age: 28 },
          },
        ]);
      });
    });
    describe('and', () => {
      it('should by able with 2', async function () {
        const data = applyODataParams(
          testData,
          "$filter=user eq 'robert' and details/age eq 38"
        );
        expect(data).toStrictEqual([
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
        ]);
      });
      it('should by able with 3', async function () {
        const data = applyODataParams(
          testData,
          "$filter=user eq 'robert' and details/age eq 38 and color eq 'yellow'"
        );
        expect(data).toStrictEqual([
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
        ]);
      });
    });
    describe('or', () => {
      it('should by able with 2', async function () {
        const data = applyODataParams(
          testData,
          "$filter=user eq 'robert' or details/city eq 'Zurich'"
        );
        expect(data).toStrictEqual([
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'klaus',
            color: 'orange',
            details: { city: 'Zurich', age: 38 },
          },
          { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
          {
            user: 'robert',
            color: 'azure',
            details: { city: 'Manchester', age: 28 },
          },
        ]);
      });
      it('should by able with 3', async function () {
        const data = applyODataParams(
          testData,
          "$filter=user eq 'robert' or details/city eq 'Zurich' or details/age lt 28"
        );
        expect(data).toStrictEqual([
          {
            user: 'robert',
            color: 'yellow',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'klaus',
            color: 'orange',
            details: { city: 'Zurich', age: 38 },
          },
          {
            user: 'frank',
            color: 'red',
            details: { city: 'Frankfurt', age: 26 },
          },
          {
            user: 'maria',
            color: 'orange',
            details: { city: 'London', age: 20 },
          },
          { user: 'andy', color: 'pink', details: { city: 'Zurich', age: 38 } },
          {
            user: 'robert',
            color: 'azure',
            details: { city: 'Manchester', age: 28 },
          },
        ]);
      });
    });
  });
});
