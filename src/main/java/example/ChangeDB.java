package example;
import com.github.javafaker.Faker;
import org.apache.commons.lang3.RandomStringUtils;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.HashSet;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;


public class ChangeDB implements RequestHandler<Map<String,Object>, String>{
    private static final String SELECT_RANDOM_ROW = "SELECT id FROM user_info ORDER BY RANDOM() LIMIT 10";
    private static final Logger logger = Logger.getLogger(ChangeDB.class.getName());

    @Override
    public String handleRequest(Map<String,Object> event, Context context)
    {
        logger.setLevel(Level.INFO);
        LambdaLogger logger = context.getLogger();
        logger.log("EVENT TYPE: " + event.getClass());
        Connection con = connect();
        return changeDB(con);
    }

    public static void main(String[] args) {
        logger.setLevel(Level.INFO);
    }
    public static byte[] getSHA(String input) throws NoSuchAlgorithmException
    {
        // Static getInstance method is called with hashing SHA
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        // digest() method called
        // to calculate message digest of an input
        // and return array of byte
        return md.digest(input.getBytes(StandardCharsets.UTF_8));
    }
    public static String toHexString(byte[] hash)
    {
        // Convert byte array into signum representation
        BigInteger number = new BigInteger(1, hash);

        // Convert message digest into hex value
        StringBuilder hexString = new StringBuilder(number.toString(16));

        // Pad with leading zeros
        while (hexString.length() < 64)
        {
            hexString.insert(0, '0');
        }

        return hexString.toString();
    }
    private static Connection connect() {
        Connection con = null;
        try {
            Class.forName("org.postgresql.Driver");
            String dbName = System.getenv("RDS_DB_NAME");
            String userName = System.getenv("RDS_USERNAME");
            String password = System.getenv("RDS_PASSWORD");
            String hostname = System.getenv("RDS_HOSTNAME");
            String port = System.getenv("RDS_PORT");
            String jdbcUrl = "jdbc:postgresql://" + hostname + ":" + port + "/" + dbName + "?user=" + userName + "&password=" + password;
            logger.info("Getting remote connection with connection string from environment variables.");
            con = DriverManager.getConnection(jdbcUrl);
            logger.info("Remote connection successful.");
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println(e);
        }
        return con;
    }
    private static String changeDB(Connection con){
        int choice = 0;
        Random rand = new Random();
        choice = rand.nextInt(3);
        switch (choice) {
            case 0:
                return deleteRow(con);
            case 1:
                return updateRow(con);
            case 2:
                return insertRow(con);
            default:
                break;
        }
        return "No change";
    }

    private static String deleteRow(Connection con){
        String DELETE_ROW = "DELETE FROM user_info WHERE id = ?";
        try (Statement stmt = con.createStatement()) {
            ResultSet rs = stmt.executeQuery(SELECT_RANDOM_ROW);
            while (rs.next()) {
                int id = rs.getInt("id");
                PreparedStatement st = con.prepareStatement(DELETE_ROW);
                st.setInt(1, id);
                st.executeUpdate();
                st.close();
            }
        } catch (SQLException e) {
            logger.warning(e.getMessage());
        }
        logger.info("Deleted 10 rows");
        return "Deleted 10 rows";
    }
    private static String updateRow(Connection con){
        try (Statement stmt = con.createStatement()) {
            ResultSet rs = stmt.executeQuery(SELECT_RANDOM_ROW);
            while (rs.next()) {
                int id = rs.getInt("id");
                Faker faker = new Faker();
                String randomString = RandomStringUtils.randomAlphanumeric(10);
                PreparedStatement st = con.prepareStatement("UPDATE user_info SET password = ?, username = ?, first_name = ?, last_name = ?, email = ? WHERE id = ?");
                st.setString(1, toHexString(getSHA(randomString)));
                st.setString(2, randomString);
                st.setObject(3, faker.name().firstName());
                st.setObject(4, faker.name().lastName());
                st.setObject(5, faker.internet().emailAddress());
                st.setInt(6, id);
                st.executeUpdate();
                st.close();
            }
            logger.info("Updated 10 rows");
            return "Updated 10 rows";
        } catch (SQLException | NoSuchAlgorithmException e) {
            logger.warning(e.getMessage());
            return e.getMessage();
        }
    }
    private static String insertRow(Connection con){
            String INSERT_USERS_SQL = "INSERT INTO user_info" +
                    "  (id, password, username, first_name, last_name, email, is_staff, is_course_manager, is_org_manager) " +
                    "VALUES " +
                    " (?, ?, ?, ?, ?, ?, ?, ?, ?);";

            HashSet<Integer> set = new HashSet<>();

        User[] userArray = new User[12];
        Random rand = new Random();
        try {
            for (int i = 0; i < 12; i++) {
                Faker faker = new Faker();
                String randomString = RandomStringUtils.randomAlphanumeric(10);
                int randomId = rand.nextInt(10000000);
                while (set.contains(randomId)){
                    randomId = rand.nextInt(10000000);
                }
                set.add(randomId);
                userArray[i] = new User(randomId, toHexString(getSHA(randomString)), randomString,
                        faker.name().firstName(), faker.name().lastName(), faker.internet().emailAddress(), rand.nextBoolean(),
                        rand.nextBoolean(), rand.nextBoolean());
            }
        }catch (NoSuchAlgorithmException e) {
            logger.warning("Exception thrown for incorrect algorithm: " + e);
        }

        for (User user : userArray){
            try {
                TimeUnit.MILLISECONDS.sleep(10);
                PreparedStatement st = con.prepareStatement(INSERT_USERS_SQL);
                st.setInt(1, user.getId());
                st.setString(2, user.getPassword());
                st.setString(3, user.getUsername());
                st.setObject(4, user.getFirst_name());
                st.setObject(5, user.getLast_name());
                st.setObject(6, user.getEmail());
                st.setBoolean(7, user.isIs_staff());
                st.setBoolean(8, user.isIs_course_manager());
                st.setBoolean(9, user.isIs_org_manager());
                st.executeUpdate();
                st.close();
            } catch (SQLException |InterruptedException e) {
                logger.warning(e.getMessage());
            }
        }
        logger.info("Inserted 12 rows");
        return "Inserted 12 rows";
    }
}
