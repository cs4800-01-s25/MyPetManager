package mypetmanager;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.junit.Test;

public class CalculatorTest {

    @Test
    public void testAdd() {
        Calculator calc = new Calculator();
        
        // A few test cases for the add method
        assertEquals("Adding 1 + 1 should be 2", 2, calc.add(1, 1));
        assertEquals("Adding -1 + 5 should be 4", 4, calc.add(-1, 5));
        assertEquals("Adding 0 + 0 should be 0", 0, calc.add(0, 0));
    }

    @Test
    public void testDivide() {
        Calculator calc = new Calculator();
        
        // Normal case
        assertEquals("10 / 2 should be 5", 5.0, calc.divide(10, 2), 0.000001);

        // Division by zero (expecting ArithmeticException)
        try {
            calc.divide(5, 0);
            fail("Expected an ArithmeticException to be thrown.");
        } catch (ArithmeticException e) {
            // Test passes because exception was thrown
        }
    }
}