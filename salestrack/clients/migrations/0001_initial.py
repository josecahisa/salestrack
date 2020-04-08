# Generated by Django 2.2.3 on 2019-12-17 00:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Address_Type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50, null=True, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'Tipo de Dirección',
                'verbose_name_plural': 'Tipos de Dirección',
            },
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=150, null=True, verbose_name='Nombre')),
                ('status', models.CharField(choices=[('A', 'Activo'), ('B', 'Borrado')], default='A', max_length=1, verbose_name='Estado')),
            ],
        ),
        migrations.CreateModel(
            name='Fiscal_Position',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50, null=True, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'Posición Fiscal',
                'verbose_name_plural': 'Posiciones Fiscales',
            },
        ),
        migrations.CreateModel(
            name='Phone_Type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=50, null=True, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'Tipo Teléfono',
                'verbose_name_plural': 'Tipos de Teléfonos',
            },
        ),
        migrations.CreateModel(
            name='Telephone',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.CharField(blank=True, max_length=20, null=True, verbose_name='Número')),
                ('name', models.CharField(blank=True, max_length=250, null=True, verbose_name='Descripción')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clients.Client')),
                ('phone_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='clients.Phone_Type')),
            ],
            options={
                'verbose_name': 'Teléfono',
                'verbose_name_plural': 'Teléfonos',
            },
        ),
        migrations.AddField(
            model_name='client',
            name='fiscal_position',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='clients.Fiscal_Position'),
        ),
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.CharField(blank=True, max_length=50, null=True, verbose_name='Dirección')),
                ('description', models.CharField(blank=True, max_length=250, null=True, verbose_name='Descripción')),
                ('address_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='clients.Address_Type')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='clients.Client')),
            ],
            options={
                'verbose_name': 'Dirección',
                'verbose_name_plural': 'Direcciones',
            },
        ),
    ]
