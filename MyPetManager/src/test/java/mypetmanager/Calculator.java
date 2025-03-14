package mypetmanager;

public class Calculator {

    /**
     * Returns the sum of two integers.
     */
    public int add(int a, int b) {
        return a + b;
    }

    /**
     * Returns the result of dividing 'a' by 'b'.
     * 
     * @throws ArithmeticException if 'b' is zero
     */
    public double divide(int a, int b) {
        // By default, dividing by zero in integer arithmetic throws ArithmeticException,
        // or you could explicitly check and throw:
        // if (b == 0) throw new ArithmeticException("Cannot divide by zero");
        return a / b;
    }
}