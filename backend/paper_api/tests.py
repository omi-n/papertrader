from django.test import TestCase
from paper_api.models import Ticker, UserBalance, UserStock, UserTransaction


# Create your tests here.
class TickerTestCase(TestCase):
    def setUp(self):
        Ticker.objects.create(
            ticker="AAPL",
            name="Apple Inc.",
            country="USA",
            industry="Consumer Electronics",
            sector="Technology",
        )
        Ticker.objects.create(
            ticker="MSFT",
            name="Microsoft Corporation",
            country="USA",
            industry="Software",
            sector="Technology",
        )

    def test_ticker(self):
        aapl = Ticker.objects.get(ticker="AAPL")
        msft = Ticker.objects.get(ticker="MSFT")

        self.assertEqual(aapl.name, "Apple Inc.")
        self.assertEqual(msft.name, "Microsoft Corporation")

    def test_ticker_does_not_exist(self):
        with self.assertRaises(Ticker.DoesNotExist):
            Ticker.objects.get(ticker="GOOGL")


class UserBalanceTestCase(TestCase):
    def setUp(self):
        UserBalance.objects.create(username="test_user", balance=1000.0)

    def test_user_balance(self):
        test_user = UserBalance.objects.get(username="test_user")

        self.assertEqual(test_user.balance, 1000.0)


class UserStockTestCase(TestCase):
    def setUp(self):
        UserStock.objects.create(username="test_user", ticker="AAPL", price=100.0)
        UserStock.objects.create(username="test_user", ticker="MSFT", price=200.0)

    def test_user_has_stock(self):
        aapl = UserStock.objects.get(username="test_user", ticker="AAPL")
        msft = UserStock.objects.get(username="test_user", ticker="MSFT")

        self.assertEqual(aapl.price, 100.0)
        self.assertEqual(msft.price, 200.0)

    def test_user_does_not_have_stock(self):
        with self.assertRaises(UserStock.DoesNotExist):
            UserStock.objects.get(username="test_user", ticker="GOOGL")


class UserTransactionTestCase(TestCase):
    def setUp(self):
        UserTransaction.objects.create(
            transaction_type="BUY",
            username="test_user",
            ticker="AAPL",
            amount=10,
            price=100.0,
        )
        UserTransaction.objects.create(
            transaction_type="SELL",
            username="test_user",
            ticker="MSFT",
            amount=5,
            price=200.0,
        )

    def test_user_transaction(self):
        buy_transaction = UserTransaction.objects.get(
            username="test_user", ticker="AAPL"
        )
        sell_transaction = UserTransaction.objects.get(
            username="test_user", ticker="MSFT"
        )

        self.assertEqual(buy_transaction.amount, 10)
        self.assertEqual(sell_transaction.amount, 5)

    def test_user_does_not_have_transaction(self):
        with self.assertRaises(UserTransaction.DoesNotExist):
            UserTransaction.objects.get(username="test_user", ticker="GOOGL")
