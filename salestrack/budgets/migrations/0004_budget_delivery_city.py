# Generated by Django 2.2.3 on 2019-12-26 22:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0005_auto_20191226_1932'),
        ('budgets', '0003_auto_20191217_0258'),
    ]

    operations = [
        migrations.AddField(
            model_name='budget',
            name='delivery_city',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='clients.City', verbose_name='Ciudad de Entrega'),
        ),
    ]