from datetime import datetime
from django.db import models
from clients.models import Client
from clients.models import Address
from clients.models import City
from products.models import Product


class Shipping(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Transporte"
        verbose_name_plural = "Transportes"


class PaymentTerm(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nombre")

    def __str__(self):
        return '{0}'.format(self.name)

    class Meta:
        verbose_name = "Término de Pago"
        verbose_name_plural = "Términos de Pago"

class Budget(models.Model):
    class Meta:
        verbose_name = "Presupuesto"
        verbose_name_plural = "Presupuestos"

    BUDGET_STATUS_CHOICES = (
        ('B', 'Borrador'),
        ('E', 'Enviado'),
        ('A', 'Aprobado'),
        ('F', 'Finalizado')
    )

    date = models.DateField(verbose_name="Fecha")
    client = models.ForeignKey(Client, on_delete=models.PROTECT, null=False)
    delivery_address = models.ForeignKey(Address, on_delete=models.PROTECT, null=True, blank=True)
    paymentTerm = models.ForeignKey(PaymentTerm, on_delete=models.PROTECT, null=True, blank=True)
    shipping = models.ForeignKey(Shipping, on_delete=models.PROTECT, null=True, blank=True)
    status = models.CharField(
        max_length=1,
        default='B',
        choices=BUDGET_STATUS_CHOICES,
        verbose_name="Estado"
    )
    discount = models.DecimalField(
        verbose_name="Descuento",
        max_digits=4,
        decimal_places=2,
        default=0
    )
    number = models.CharField(max_length=11, null=False, blank=True, verbose_name="Number")
    delivery_city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        verbose_name="Ciudad de Entrega"
    )
    commercial_terms = models.TextField(verbose_name="Terminos Comerciales", blank=True, default="")

    def __str__(self):
        return '{0} - {1}'.format(self.date, self.client.name)

    def set_client(self, client_id):
        client = Client.objects.get(pk=client_id)
        self.client = client

    def set_delivery_address(self, address_id):
        print('setting delivery address to id = {}'.format(address_id))
        if address_id is None:
            return

        try:
            address = Address.objects.get(pk=address_id)
            self.delivery_address = address
        except:
            print('no Address found with id = {}'.format(address_id))

    def generate_budget_number(self):
        today = datetime.today()
        str_total_budgets = str(Budget.objects.filter(date__exact=today).count() + 1)

        print(str_total_budgets)
        str_total_budgets = str_total_budgets.rjust(3, '0')
        print(str_total_budgets)
        str_new_number = today.strftime('%Y%m%d') + str_total_budgets
        print(str_new_number)
        new_number = int(str_new_number)
        self.number = new_number

    def save(self, *args, **kwargs):
        print ("saving a new budget")
        if (self.number is None or not self.number):
            self.generate_budget_number()

        if (self.date is None):
            self.date = datetime.today()

        super().save(*args, **kwargs)


class BudgetDetail(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, null=False)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, null=False)
    quantity = models.IntegerField(verbose_name="cantidad", null=False, blank=False)
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Precio Venta", default=0, null=True, blank=True)

    class Meta:
        verbose_name = "Detalle de Presupuesto"
        verbose_name_plural = "Detalles de Presupuestos"
