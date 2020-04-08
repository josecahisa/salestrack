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
    status = models.CharField(max_length=1, default='B', choices=BUDGET_STATUS_CHOICES, verbose_name="Estado")
    discount = models.DecimalField(verbose_name="Descuento", max_digits=4, decimal_places=2)
    numero = models.IntegerField(verbose_name="Numero", unique=True, auto_created=True)
    delivery_city = models.ForeignKey(City, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Ciudad de Entrega")

    def __str__(self):
        return '{0} - {1}'.format(self.date, self.client.name)

    class Meta:
        verbose_name = "Presupuesto"
        verbose_name_plural = "Presupuestos"


class BudgetDetail(models.Model):
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, null=False)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, null=False)
    quantity = models.IntegerField(verbose_name="cantidad", null=False, blank=False)
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Precio Venta", default=0, null=True, blank=True)

    class Meta:
        verbose_name = "Detalle de Presupuesto"
        verbose_name_plural = "Detalles de Presupuestos"
